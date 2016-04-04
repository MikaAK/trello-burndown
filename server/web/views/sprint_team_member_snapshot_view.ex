defmodule TrelloBurndown.SprintTeamMemberSnapshotView do
  use TrelloBurndown.Web, :view

  def render("index.json", %{sprint_team_member_snapshots: sprint_team_member_snapshots}) do
    %{data: render_many(sprint_team_member_snapshots, TrelloBurndown.SprintTeamMemberSnapshotView, "sprint_team_member_snapshot.json")}
  end

  def render("show.json", %{sprint_team_member_snapshot: sprint_team_member_snapshot}) do
    %{data: render_one(sprint_team_member_snapshot, TrelloBurndown.SprintTeamMemberSnapshotView, "sprint_team_member_snapshot.json")}
  end

  def render("sprint_team_member_snapshot.json", %{sprint_team_member_snapshot: sprint_team_member_snapshot}) do
    %{
      id: sprint_team_member_snapshot.id,
      sprint_snapshot_id: sprint_team_member_snapshot.sprint_snapshot_id,
      team_member_id: sprint_team_member_snapshot.team_member_id,
      points_complete: sprint_team_member_snapshot.points_complete,
      points_dev_complete: sprint_team_member_snapshot.points_dev_complete
    }
  end
end
