# Stage 1: build the Docusaurus static site
FROM node:20.19.6-alpine3.23 AS builder

# Silence npm noise; logs-max=0 stops npm writing rotating log files, which
# keeps layers whiteout-free (required for kaniko-based CI caches, harmless
# elsewhere — same rationale as woo-website-template-apiv2/pwa/Dockerfile).
ENV NPM_CONFIG_FUND=false \
    NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_LOGS_MAX=0

WORKDIR /app

# Reproducible install: lockfile-driven. --ignore-scripts because
# @conduction/theme's postinstall rebuilds ALL its token sets and needs
# `rimraf`, which the theme only declares as a devDependency — it is never
# present in a clean consumer install (it works on dev machines only when a
# global rimraf happens to be on PATH). Instead, build ONLY the openwoo
# token set explicitly below, with the tools the theme DOES install as real
# dependencies (sass, style-dictionary), skipping the rimraf clean step
# (dist/ cannot pre-exist in a fresh install). No other package in this
# tree needs install scripts (pure-JS stack).
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts \
 && cd node_modules/@conduction/theme/other/openwoo-design-tokens \
 && /app/node_modules/.bin/sass --no-source-map src/:dist/ \
 && /app/node_modules/.bin/style-dictionary build --config ./style-dictionary.config.js \
 && test -f dist/design-tokens.css \
 && test -f dist/font.css

COPY . .
RUN npm run build

# Stage 2: serve via nginx (alpine — minimal attack surface), unprivileged
FROM nginx:1.30.4-alpine3.24
COPY --from=builder /app/build /usr/share/nginx/html

RUN chown -R nginx:nginx /usr/share/nginx && chmod -R 755 /usr/share/nginx && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    chown -R nginx:nginx /etc/nginx/conf.d
# NB no pid-file setup here: the pid lives in /tmp (see docker/nginx.conf) —
# the standard unprivileged-nginx pattern.

COPY docker/nginx.conf /etc/nginx/nginx.conf
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
# templates/includes/ maps to conf.d/includes/ — outside the conf.d/*.conf
# auto-include glob, pulled in explicitly by default.conf
COPY docker/security-headers.conf.template /etc/nginx/templates/includes/security-headers.conf.template
ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx/conf.d
ENV NGINX_ENVSUBST_TEMPLATE_DIR=/etc/nginx/templates
# Allowed iframe ancestors (CSP frame-ancestors). Override at runtime if the
# docs ever need embedding, e.g. "'self' https://portal.example.nl"
ENV FRAME_ANCESTORS="'none'"

USER nginx
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://localhost:8080/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
