const removeLeadingAndTrailingSpaces = (input) => {
	return input.trim();
}

const removeMiddleSpacesMoreThanOne = (input) => {
	return input.trim().replace(/\s\s+/g, ' ');
}

module.exports = {
	removeLeadingAndTrailingSpaces,
	removeMiddleSpacesMoreThanOne
}