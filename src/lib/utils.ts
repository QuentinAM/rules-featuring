export function millisToMinutesAndSeconds(millis: number) {
	var minutes: number = Math.floor(millis / 60000);
	var seconds: number = parseFloat(((millis % 60000) / 1000).toFixed(0));
	return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}
