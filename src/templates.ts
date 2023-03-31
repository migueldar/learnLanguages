export function index_template(groups: string[]) {
	let html_string: string = "";
	for (let group of groups) {
		html_string += `<a href=/${group}/list> ${group} </a><br><br>`;
	}
	return /* HTML */ `<!DOCTYPE html>
		<html>
			<head>
				<title>Menu</title>
			</head>
			<body>
				<h1>Select the group you wanna practice</h1>
				${html_string}
			</body>
		</html>`;
}

export function list_template(words: string[][], group: string) {
	let wordsForLesson_html = "";

	for (let word of words) {
		wordsForLesson_html += `<p> ${word[0]} // ${word[1]}</p>`;
	}
	return /* HTML */ `<!DOCTYPE html>
        <html>
            <head>
                <title>${group}</title>
            </head> 
            <body>
                <h1>${group}</h1>
                <p>${wordsForLesson_html}</p>
                <a href=/${group}/lesson>Start Lesson</a>
            </body>
        </html>`;
}

export function lesson_template(word: string, group: string) {
	return /* HTML */ `<!DOCTYPE html>
		<html>
			<head>
				<title>${group}</title>
			</head>
			<body>
				<h1>${group}</h1>
				<form
					action="http://localhost:8080/${group}/lesson"
					method="post"
				>
					<p>${word}</p>
					<p>
						<input type="text" name="answer" autocomplete="off" />
					</p>
					<p><button type="submit">Submit</button></p>
				</form>
				<img
					style="position:fixed;bottom:0px;right:10px;"
					src="/russian_keyboard"
					alt="russian keyboard img"
				/>
			</body>
		</html>`;
}

export function lesson_answer_template(
	word: string[],
	group: string,
	answer: string
) {
	return /* HTML */ `<!DOCTYPE html>
    <html>
        <head>
            <title>${group}</title>
        </head>
        <body>
            <h1>${group}</h1>
            <p>${word[0]}</p>
			<input type="text" name="answer" autocomplete="off" placeholder="${answer}"/>
            <p style="color:red;">Incorrect :(, the correct answer is: ${word[1]}</p>
            <a href=/${group}/lesson> Next <a>
        </body>	
    </html>`;
}
