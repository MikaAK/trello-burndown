defmodule TrelloBurndown do
  use Application
  import IEx

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      # Start the endpoint when the application starts
      supervisor(TrelloBurndown.Endpoint, []),
      # Start the Ecto repository
      supervisor(TrelloBurndown.Repo, []),
      # Here you could define other workers and supervisors as children
      # worker(TrelloBurndown.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: TrelloBurndown.Supervisor]

    if Mix.env === :dev do
      Path.expand("../.env")
        |> Dotenv.load
        |> Map.get(:values)
        |> load_into_env
    end

    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    TrelloBurndown.Endpoint.config_change(changed, removed)
    :ok
  end

  defp load_into_env(env) do
    keys = HashDict.keys env

    for key <- keys, into: [] do
      System.put_env(key, HashDict.get(env, key))
    end
  end
end
