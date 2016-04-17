defmodule TrelloBurndown.TrelloTest do
  use ExUnit.Case, async: true
  alias TrelloBurndown.Trello

  @test_secret System.get_env("TRELLO_TEST_SECRET")
  @no_lists_sprint_id "9swXhkii"
  @test_sprint %{
    id: "xTZvZ83j",
    sprint_name: "Zucchini",
    points: 35
  }

  test "without lists created it can get board" do
    assert {:ok, _} = Trello.get_board(@no_lists_sprint_id, @test_secret)
  end

  test "response message of 'invalid id' if board_id is invalid" do
    assert {:error, "invalid id"} = Trello.get_board("willobark", @test_secret)
  end

  test "response message of 'invalid token' if secret is invalid" do
    assert {:error, "invalid token"} = Trello.get_board(@test_sprint.id, "markhold")
  end

  test "get board pulls full board with lists sorted and total points" do
    assert {:ok, board} = Trello.get_board(@test_sprint.id, @test_secret) 
    assert board.points === @test_sprint.points
    assert has_all_trello_lists(board)
  end

  defp has_all_trello_lists(board) do
    Enum.reduce Trello.used_list_atoms, true, fn(atom, acc) ->
      if (!acc), do: acc, else: Map.has_key?(board.lists, atom)
    end
  end
end
