defmodule TrelloBurndown.Sprint do
  use TrelloBurndown.Web, :model

  schema "sprints" do
    field :board_id, :string
    field :sprint_name, :string
    field :point_total, :integer
    field :holidays, {:array, :integer}
    belongs_to :team, Team

    timestamps
  end

  @required_fields ~w(board_id sprint_name point_total)
  @optional_fields ~w(holidays)

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
