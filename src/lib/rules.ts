export const TheMindRules: string = `
    One person should select the amount of cards to deal then click DEAL CARDS.

    Cards numbered from 1 to 100 will be dealt randomly to all players. Together you must play your numbers in ascending order. 
    
    But, NO TALKING is allowed, you must simply vibe it out! Click your card (blue button) when you think you have the next highest number. 
`;

export const ExtremeWordsRules: string = `
    One person should pick a category (or use their own custom). Words will appear on the screen.
    Explain as many words as possible in the time limit. However, you must obey the rule that appears on the screen.
    If you correctly explain the word (ie someone guesses it) click Got the Word. If you failed to explain, or failed the rule, click Pass the Word.
    Your score will be calculated based on how many words you guessed in the time frame!
`;

export const getRules = (game: string) => {
	if (game == "Extreme Words") return ExtremeWordsRules;
	if (game == "The Mind") return TheMindRules;
	return "Have fun!";
};
