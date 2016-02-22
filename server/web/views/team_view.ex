defmodule TrelloBurndown.TeamView do
  use TrelloBurndown.Web, :view

  def render("index.json", %{teams: teams}) do
    %{data: render_many(teams, TrelloBurndown.TeamView, "team.json")}
  end

  def render("show.json", %{team: team}) do
    %{data: render_one(team, TrelloBurndown.TeamView, "team.json")}
  end

  def render("team.json", %{team: team}) do
    %{id: team.id,
      name: team.name}
  end
end
