use Mix.Config

# For production, we configure the host to read the PORT
# from the system environment. Therefore, you will need
# to set PORT=80 before running your server.
#
# You should also configure the url host to something
# meaningful, we use this information when generating URLs.
#
# Finally, we also include the path to a manifest
# containing the digested version of static files. This
# manifest is generated by the mix phoenix.digest task
# which you typically run after static files are built.
config :trello_burndown, TrelloBurndown.Endpoint,
  http: [port: {:system, "PORT"}],
  url: [host: "104.236.43.15", port: 80],
  cache_static_manifest: "priv/static/manifest.json"

# Do not print debug messages in production
config :logger, level: :info

# ## SSL Support
#
# To get SSL working, you will need to add the `https` key
# to the previous section and set your `:url` port to 443:
#
#     config :trello_burndown, TrelloBurndown.Endpoint,
#       ...
#       url: [host: "example.com", port: 443],
#       https: [port: 443,
#               keyfile: System.get_env("SOME_APP_SSL_KEY_PATH"),
#               certfile: System.get_env("SOME_APP_SSL_CERT_PATH")]
#
# Where those two env variables return an absolute path to
# the key and cert in disk or a relative path inside priv,
# for example "priv/ssl/server.key".
#
# We also recommend setting `force_ssl`, ensuring no data is
# ever sent via http, always redirecting to https:
#
#     config :trello_burndown, TrelloBurndown.Endpoint,
#       force_ssl: [hsts: true]
#
# Check `Plug.SSL` for all available options in `force_ssl`.

# ## Using releases
#
# Alternatively, you can configure exactly which server to
# start per endpoint:
#
#     config :trello_burndown, TrelloBurndown.Endpoint, server: true
#
# You will also need to set the application root to `.` in order
# for the new static assets to be served after a hot upgrade:
#
#     config :trello_burndown, TrelloBurndown.Endpoint, root: "."

# Finally import the config/prod.secret.exs
# which should be versioned separately.
config :trello_burndown, TrelloBurndown.Endpoint,
  secret_key_base: {:system, "SECRET"}

config :phoenix, :serve_endpoints, true

config :trello_burndown, TrelloBurndown.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: {:system, "DB_USERNAME"},
  password: {:system, "DB_PASSWORD"},
  database: "trello_burndown",
  hostname: "localhost",
  pool_size: 10
