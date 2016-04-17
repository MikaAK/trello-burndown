defmodule TrelloBurndown.SprintView do
  import IEx
  use TrelloBurndown.Web, :view

  def render("index.json", %{sprints: sprints}) do
    %{data: render_many(sprints, TrelloBurndown.SprintView, "sprint.json")}
  end

  def render("show.json", %{sprint: sprint}) do
    %{data: render_one(sprint, TrelloBurndown.SprintView, "sprint.json")}
  end

  def render("sprint.json", %{sprint: sprint}) do
    params = %{
      id: sprint.id,
      board_id: sprint.board_id,
      sprint_name: sprint.sprint_name,
      team_id: sprint.team_id,
      start_date: sprint.start_date,
      end_date: sprint.end_date,
      points: sprint.points,
      created: sprint.inserted_at
    }

    if sprint.team && Ecto.assoc_loaded?(sprint.team) do
      json = TrelloBurndown.TeamView.render "team.json", %{team: sprint.team}

      Map.put(params, :team, json)
    else
      params
    end
  end
end
