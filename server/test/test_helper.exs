System.put_env "MIX_ENV", "test"
ExUnit.start

Mix.Task.run "ecto.create", ~w(-r TrelloBurndown.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r TrelloBurndown.Repo --quiet)
Ecto.Adapters.SQL.Sandbox.mode(TrelloBurndown.Repo, :manual)
