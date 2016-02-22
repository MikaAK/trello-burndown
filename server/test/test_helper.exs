ExUnit.start

Mix.Task.run "ecto.create", ~w(-r TrelloBurndown.Repo --quiet)
Mix.Task.run "ecto.migrate", ~w(-r TrelloBurndown.Repo --quiet)
Ecto.Adapters.SQL.begin_test_transaction(TrelloBurndown.Repo)

