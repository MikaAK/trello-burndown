defmodule TrelloBurndown.SprintTeamMemberSnapshot do
  use TrelloBurndown.Web, :model

  schema "sprint_team_member_snapshots" do
    belongs_to :sprint, TrelloBurndown.Sprint
    belongs_to :team_member, TrelloBurndown.TeamMember
    field :points_complete, :integer
    field :points_dev_complete, :integer

    timestamps
  end

  @required_fields ~w(sprint_snapshot_id team_member_id points_complete points_dev_complete)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
