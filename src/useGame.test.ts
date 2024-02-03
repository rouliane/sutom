import { renderHook, act } from '@testing-library/react'
import {useGame} from "./useGame";

/**
 * TODO
 * - [DONE] it returns the default application state
 * - [DONE] it can compute if the typed letter is correctly placed
 * - [DONE] it supports only letters and dots
 * - [DONE] it does not allow the current attempt to be longer that the word to guess
 * - [DONE] it can validate an attempt and compute the result
 * - [DONE] it allows the last character of the current attempt to be removed, except if there is only 1 character
 * - [DONE] it can compute if the typed letter is misplaced and is present only 1 time in the word
 * - [DONE] it can compute that the the typed letter is incorrect if it does exist 1 time in the word but is already marked as correct elsewhere
 * - [DONE] it can compute if the typed letter is misplaced with a word that contains this letter 2 times and already 1 correctly placed
 * - [DONE] it can compute that the the typed letter is incorrect if it does exist 1 time in the word but is already marked as misplaced at a previous position in the word
 * - [DONE] it can compute that the typed letter is marked as misplaced as much times as the number of occurrences of the letter in the word
 * - [DONE] it marks as incorrect a letter that exist 2 times in the word but is already correctly placed everywhere
 * - it does not support more that 6 attempts
 * - it handles the win game condition
 * - it handles the lose game condition
 * - an attempt can't be submited if there is dots in it
 */

const defaultCurrentAttempt = [
    {letter: "p", isCorrect: true, isMisplaced: false},
    {letter: null, isCorrect: false, isMisplaced: false},
    {letter: null, isCorrect: false, isMisplaced: false},
    {letter: null, isCorrect: false, isMisplaced: false},
];

test('it returns the default application state', () => {
    const { result } = renderHook(() => useGame("pneu"))
    expect(result.current.wordToGuess).toBe("pneu")
    expect(result.current.previousAttempts).toStrictEqual([])
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt)
})

test ('it can compute if the typed letter is correctly placed', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("n")
    });
    act(() => {
        result.current.typeLetter("a")
    });
    act(() => {
        result.current.typeLetter("l")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "n", isCorrect: true, isMisplaced: false},
        {letter: "a", isCorrect: false, isMisplaced: false},
        {letter: "l", isCorrect: false, isMisplaced: false},
    ]]);
})

test('it supports only letters and dots', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("1")
    });
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt)
});

test('it does not allow the current attempt to be longer that the word to guess', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("l")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "o", isCorrect: false, isMisplaced: false},
        {letter: "e", isCorrect: true, isMisplaced: false},
        {letter: "l", isCorrect: false, isMisplaced: false},
    ]])
});

test('it can validate an attempt and compute the result', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("l")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([
        [
            {letter: "p", isCorrect: true, isMisplaced: false},
            {letter: "o", isCorrect: false, isMisplaced: false},
            {letter: "e", isCorrect: true, isMisplaced: false},
            {letter: "l", isCorrect: false, isMisplaced: false},
        ]
    ])
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt);
});

test('it allows the last character of the current attempt to be removed, except if there is only 1 character', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("Backspace")
    });
    expect(result.current.currentAttempt).toStrictEqual([
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "o", isCorrect: false, isMisplaced: false},
        {letter: null, isCorrect: false, isMisplaced: false},
        {letter: null, isCorrect: false, isMisplaced: false},
    ])
    act(() => {
        result.current.typeLetter("Backspace")
    });
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt)
    act(() => {
        result.current.typeLetter("Backspace")
    });
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt)
});

test('it can compute if the typed letter is misplaced and is present only 1 time in the word', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("a")
    });
    act(() => {
        result.current.typeLetter("n")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });

    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "a", isCorrect: false, isMisplaced: false},
        {letter: "n", isCorrect: false, isMisplaced: true},
        {letter: "e", isCorrect: false, isMisplaced: true},
    ]])
});

test('it can compute that the the typed letter is incorrect if it does exist 1 time in the word but is already marked as correct elsewhere', () => {
    const { result } = renderHook(() => useGame("pneu"))
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("p")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "o", isCorrect: false, isMisplaced: false},
        {letter: "o", isCorrect: false, isMisplaced: false},
        {letter: "p", isCorrect: false, isMisplaced: false},
    ]])
});

test('it can compute that the the typed letter is incorrect if it does exist 1 time in the word but is already marked as misplaced at a previous position in the word', () => {
    const { result } = renderHook(() => useGame("peplum"))
    act(() => {
        result.current.typeLetter("o")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("l")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "o", isCorrect: false, isMisplaced: false},
        {letter: "e", isCorrect: false, isMisplaced: true},
        {letter: "l", isCorrect: true, isMisplaced: false},
        {letter: "e", isCorrect: false, isMisplaced: false},
        {letter: "e", isCorrect: false, isMisplaced: false},
    ]])
});

test('it can compute if the typed letter is misplaced with a word that contains this letter 2 times and already 1 correctly placed', () => {
    //                                           perdue
    const { result } = renderHook(() => useGame("peplem"))
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("r")
    });
    act(() => {
        result.current.typeLetter("d")
    });
    act(() => {
        result.current.typeLetter("u")
    });
    act(() => {
        result.current.typeLetter("e")
    });act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "e", isCorrect: true, isMisplaced: false},
        {letter: "r", isCorrect: false, isMisplaced: false},
        {letter: "d", isCorrect: false, isMisplaced: false},
        {letter: "u", isCorrect: false, isMisplaced: false},
        {letter: "e", isCorrect: false, isMisplaced: true},
    ]])
});

test('it can compute that the typed letter is marked as misplaced as much times as the number of occurrences of the letter in the word', () => {
    const { result } = renderHook(() => useGame("piegees"))
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("r")
    });
    act(() => {
        result.current.typeLetter("m")
    });
    act(() => {
        result.current.typeLetter("i")
    });
    act(() => {
        result.current.typeLetter("s")
    });
    act(() => {
        result.current.typeLetter("e")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([[
        {letter: "p", isCorrect: true, isMisplaced: false},
        {letter: "e", isCorrect: false, isMisplaced: true},
        {letter: "r", isCorrect: false, isMisplaced: false},
        {letter: "m", isCorrect: false, isMisplaced: false},
        {letter: "i", isCorrect: false, isMisplaced: true},
        {letter: "s", isCorrect: false, isMisplaced: true},
        {letter: "e", isCorrect: false, isMisplaced: true},
    ]])
});

test('it marks as incorrect a letter that exist 2 times in the word but is already correctly placed everywhere', () => {
    const { result } = renderHook(() => useGame("papi"))
    act(() => {
        result.current.typeLetter("p")
    });
    act(() => {
        result.current.typeLetter("p")
    });
    act(() => {
        result.current.typeLetter("p")
    });
    act(() => {
        result.current.typeLetter("Enter")
    });
    expect(result.current.previousAttempts).toStrictEqual([
        [
            {letter: "p", isCorrect: true, isMisplaced: false},
            {letter: "p", isCorrect: false, isMisplaced: false},
            {letter: "p", isCorrect: true, isMisplaced: false},
            {letter: "p", isCorrect: false, isMisplaced: false},
        ]
    ])
    expect(result.current.currentAttempt).toStrictEqual(defaultCurrentAttempt);
});
