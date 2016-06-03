defmodule TrelloBurndown.SprintSnapshot do
  import Logger

  use TrelloBurndown.Web, :model

  alias TrelloBurndown.Sprint
  alias TrelloBurndown.Repo
  alias TrelloBurndown.Trello
  alias TrelloBurndown.SprintSnapshot

  schema "sprint_snapshots" do
    field :points_left, :integer
    field :points_complete, :integer
    field :points_dev_complete, :integer
    field :in_progress_points, :integer

    belongs_to :sprint, TrelloBurndown.Sprint
    has_many :sprint_team_member_snapshots, TrelloBurndown.SprintTeamMemberSnapshot

    timestamps
  end

  @required_fields ~w(points_left points_complete points_dev_complete)a
  @optional_fields ~w()a

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ %{}) do
    model
      |> cast(params, Enum.concat(@required_fields, @optional_fields))
      |> validate_required(@required_fields)
      |> assoc_constraint(:sprint)
  end

  def take_snapshots do
    Logger.debug "Taking Snapshot"

    sprints = create_snapshots_from_sprints Sprint.get_active

    if (Enum.any? sprints) do
      Enum.each(sprints, &Repo.insert/1)
      Logger.debug("Created #{length(sprints)} Snapshots")
    end
  end

  defp create_snapshots_from_sprints(sprints) do
    Enum.map sprints, fn(sprint) ->
      with {:ok, board} <- Trello.get_board sprint.board_id, sprint.auth_token do
        lists = board.lists

        %SprintSnapshot{
          sprint_id: sprint.id,
          points_left: calculate_list_points(lists.uncompleted),
          points_dev_complete: calculate_list_points(lists.dev_complete),
          points_complete: calculate_list_points(lists.complete),
          in_progress_points: calculate_list_points(lists.in_progress)
        }
      end
    end
  end

  defp calculate_list_points(lists) do
    Enum.reduce lists, 0, fn(list, acc) ->
      acc + list.points
    end
  end
end
