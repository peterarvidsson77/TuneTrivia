import { describe, it, expect } from "vitest";
import { highscoreInput } from "../src/validation";

describe("highscoreInput", () => {
  it("accepterar giltig indata", () => {
    const r = highscoreInput.safeParse({ team_name: "Laget", players: ["Anna", "Björn"], score: 10 });
    expect(r.success).toBe(true);
  });

  it("kräver minst 2 spelare", () => {
    expect(highscoreInput.safeParse({ team_name: "X", players: ["Anna"], score: 1 }).success).toBe(false);
  });

  it("tillåter högst 4 spelare", () => {
    const r = highscoreInput.safeParse({ team_name: "X", players: ["A", "B", "C", "D", "E"], score: 1 });
    expect(r.success).toBe(false);
  });

  it("kräver icke-tomt lagnamn", () => {
    expect(highscoreInput.safeParse({ team_name: "   ", players: ["A", "B"], score: 1 }).success).toBe(false);
  });

  it("kräver heltal >= 0 för score", () => {
    expect(highscoreInput.safeParse({ team_name: "X", players: ["A", "B"], score: -1 }).success).toBe(false);
    expect(highscoreInput.safeParse({ team_name: "X", players: ["A", "B"], score: 2.5 }).success).toBe(false);
  });

  it("trimmar lagnamn och spelarnamn", () => {
    const r = highscoreInput.safeParse({ team_name: "  Laget  ", players: [" Anna ", "Björn"], score: 3 });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.team_name).toBe("Laget");
      expect(r.data.players[0]).toBe("Anna");
    }
  });
});
