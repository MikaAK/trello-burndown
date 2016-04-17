defmodule TrelloBurndown.Team do
  use TrelloBurndown.Web, :model

  schema "teams" do
    field :name, :string
    has_many :team_members, TrelloBurndown.TeamMember

    timestamps
  end

  @required_fields ~w(name)a
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
      |> cast_assoc(:team_members)
  end
end
