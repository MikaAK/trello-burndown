defmodule TrelloBurndown.TeamView do
  use TrelloBurndown.Web, :view

  def render("index.json", %{teams: teams}) do
    %{data: render_many(teams, TrelloBurndown.TeamView, "team.json")}
  end

  def render("show.json", %{team: team}) do
    %{data: render_one(team, TrelloBurndown.TeamView, "team.json")}
  end

  def render("team.json", %{team: team}) do
    params = %{
      id: team.id,
      name: team.name
    }

    if Ecto.assoc_loaded? team.team_members do
      members = for member <- team.team_members, into: [] do
        TrelloBurndown.TeamMemberView.render("team_member.json", %{team_member: member})
      end

      Map.put(params, :team_members, members)
    else
      params
    end
  end
end
