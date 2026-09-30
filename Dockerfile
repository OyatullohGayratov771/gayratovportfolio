FROM nginx:1.27-alpine
LABEL org.opencontainers.image.title="Portfolio" \
      org.opencontainers.image.description="Gayratov Oyatulloh — personal portfolio site"

RUN adduser -D -H -u 10001 portfolio

COPY nginx.conf /etc/nginx/nginx.conf
COPY --chown=portfolio:portfolio site /usr/share/nginx/html

USER portfolio
EXPOSE 8181

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8181/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
