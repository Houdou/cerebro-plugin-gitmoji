const Fuse = require('fuse.js');
const {gitmojis} = require('./gitmoji.json');

const FuzeOptions = {
  shouldSort: true,
	tokenize: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    {name: "name", weight: 0.3},
    {name: "description", weight: 0.7}
	]
};
const fuse = new Fuse(gitmojis, FuzeOptions); // "list" is the item array

export const fn = ({ term, display, actions }) => {
	const match = term.match(/^gitmoji\s(.+)/);
	if(!match) return;

	const results = fuse.search(match[1]);

	const response = results.map(r => ({
		id: r.code,
		title: `${r.emoji} - ${r.name}`,
		subtitle: r.description,
		onSelect: event => {
			actions.copyToClipboard(r.code);
		}
	}));

  display(response);
}
