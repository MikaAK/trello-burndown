use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :trello_burndown, TrelloBurndown.Endpoint,
  http: [port: 3000],
  debug_errors: true,
  code_reloader: true,
  check_origin: false
# Add when fixed
# watchers: [node: ["../bin/.compiled/webpack-ng2-seed.js", "start", "client"]]

# Watch static and templates for browser reloading.
config :trello_burndown, TrelloBurndown.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$},
      ~r{lib/trello_burndown/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development.
# Do not configure such in production as keeping
# and calculating stacktraces is usually expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :trello_burndown, TrelloBurndown.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: "postgres",
  password: "postgres",
  database: "trello_burndown_dev",
  hostname: "localhost",
  pool_size: 10

config :trello,
  secret: {:system, "TRELLO_KEY"}
