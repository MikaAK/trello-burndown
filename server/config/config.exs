# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# Configures the endpoint
config :trello_burndown, TrelloBurndown.Endpoint,
  url: [host: "localhost"],
  root: Path.dirname(__DIR__),
  secret_key_base: "c6z7yjrPySkF37F42H7oILzB/aOq9dcd7HIWo4uQSK4pJ5rOhheci4tXYAu+9SYW",
  render_errors: [accepts: ~w(html json)],
  pubsub: [name: TrelloBurndown.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"

# Configure phoenix generators
config :phoenix, :generators,
  migration: true,
  binary_id: false

config :quantum,
  timezone: :local,
  cron: [
    "0 5 * * 1-5": {TrelloBurndown.SprintSnapshot, :take_snapshots}
  ]

config :trello,
  secret: {:system, "TRELLO_KEY"}
