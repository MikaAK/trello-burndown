defmodule TrelloBurndown.TeamMemberView do
  use TrelloBurndown.Web, :view

  def render("index.json", %{team_members: team_members}) do
    %{data: render_many(team_members, TrelloBurndown.TeamMemberView, "team_member.json")}
  end

  def render("show.json", %{team_member: team_member}) do
    %{data: render_one(team_member, TrelloBurndown.TeamMemberView, "team_member.json")}
  end

  def render("team_member.json", %{team_member: team_member}) do
    %{id: team_member.id,
      velocity: team_member.velocity,
      trello_id: team_member.trello_id,
      team_id: team_member.team_id}
  end
end
