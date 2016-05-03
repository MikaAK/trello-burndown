defmodule TrelloBurndown.Mixfile do
  use Mix.Project

  def project do
    [app: :trello_burndown,
     version: "0.0.1",
     elixir: "~> 1.2",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     aliases: aliases,
     deps: deps]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {TrelloBurndown, []},
     applications: app_list(Mix.env)]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.1.4"},
     {:postgrex, ">= 0.0.0"},
     {:ecto, "~> 2.0.0-rc.0", override: true},
     {:phoenix_ecto, "~> 3.0.0-rc.0"},
     {:phoenix_html, "~> 2.4"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:gettext, "~> 0.9"},
     {:cowboy, "~> 1.0"},
     {:exrm, "~> 1.0.2"},
     {:httpoison, "~> 0.8.2"},
     {:trello, "~> 1.1.0"},
     {:quantum, ">= 1.7.1"},
     {:exfile, "~> 0.3.2"},
     {:exfile_imagemagick, "~> 0.1.2"},
     {:dotenv, "~> 2.0.0", only: [:dev, :test]}]
  end

  defp app_list(:dev), do: [:dotenv | app_list]
  defp app_list(:test), do: [:dotenv | app_list]
  defp app_list(_), do: app_list
  defp app_list do
    [
      :phoenix, :phoenix_html, :httpoison,
      :cowboy, :logger, :gettext,
      :phoenix_ecto, :postgrex, :quantum,
      :trello, :exfile, :exfile_imagemagick
    ]
  end

  # Aliases are shortcut or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"]]
  end
end
