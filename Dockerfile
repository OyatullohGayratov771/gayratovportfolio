FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="Portfolio" \
      org.opencontainers.image.description="Gayratov Oyatulloh — personal portfolio site"

RUN adduser -D -H -u 10001 portfolio

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=portfolio:portfolio site /usr/share/nginx/html

# Stamp CSS/JS links with a content hash so Cloudflare and browsers fetch the
# new file after every change instead of serving a stale cached copy.
RUN cd /usr/share/nginx/html \
 && css=$(md5sum styles.css | cut -c1-8) \
 && js=$(md5sum script.js | cut -c1-8) \
 && sed -i -e "s|/styles.css\"|/styles.css?v=$css\"|" -e "s|/script.js\"|/script.js?v=$js\"|" *.html

USER portfolio
EXPOSE 8181

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8181/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
