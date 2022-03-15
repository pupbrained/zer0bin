import {
	SaveOutlined,
	FileAddOutlined,
	GithubOutlined,
	CopyOutlined,
} from "@ant-design/icons-svg"
import { renderIconDefinitionToSVGElement } from "@ant-design/icons-svg/es/helpers"
import hljs from "highlight.js"
import $ from "jquery"

const config = require("../config.json")
const apiUrl = config.api_url

const extraSVGAttrs = {
	width: "1em",
	height: "1em",
	fill: "currentColor",
}

const svgSave = renderIconDefinitionToSVGElement(SaveOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})

const svgFileAdd = renderIconDefinitionToSVGElement(FileAddOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})

const svgCopy = renderIconDefinitionToSVGElement(CopyOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})

const svgGithub = renderIconDefinitionToSVGElement(GithubOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})

const lineNumbers = $(".line-numbers")
const editor = $("#text-area")
const codeViewPre = $("#code-view-pre")
const codeView = $("#code-view")
const messages = $("#messages")
const viewCounterLabel = $("#viewcounter-label")
const viewCounter = $("#viewcounter-count")

const saveButton = $("#save-button")
const newButton = $("#new-button")
const copyButton = $("#copy-button")
const githubButton = $("#github-button")

saveButton.append(svgSave)
newButton.append(svgFileAdd)
copyButton.append(svgCopy)
githubButton.append(svgGithub)

var rawContent = null

function postPaste(content: string, callback: Function) {
	const payload = { content }
	fetch(`${apiUrl}/p/n`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
	})
		.then((response) => response.json())
		.then((data) => {
			console.log(data)
			callback(null, data)
		})
		.catch((error) => {
			console.log(error)
			callback(
				error || `{"data": { "message": "An unkown error occured!" } }`
			)
		})
}

function getPaste(id: string, callback: Function) {
	fetch(`${apiUrl}/p/${id}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		referrerPolicy: "no-referrer",
	})
		.then((response) => response.json())
		.then((data) => {
			callback(null, data)
		})
		.catch((error) => {
			callback(
				error || `{"data": { "message": "An unkown error occured!" } }`
			)
		})
}

function newPaste() {
	lineNumbers.html("&gt;")

	saveButton.prop("disabled", false)
	newButton.prop("disabled", true)
	copyButton.prop("disabled", true)

	rawContent = null
	editor.val("")

	editor.show()
	viewCounterLabel.hide()
	codeViewPre.hide()
}

function addMessage(message: string) {
	let msg = $(`<li>${message}</li>`)
	messages.prepend(msg)

	setTimeout(function () {
		msg.slideUp("fast", function () {
			$(this).remove()
		})
	}, 3000)
}

function viewPaste(content: string, views: string) {
	lineNumbers.html("")
	for (let i = 1; i <= content.split("\n").length; i++) {
		lineNumbers.append(`${i}
<br>`)
	}
	codeView.html(hljs.highlightAuto(content).value)

	saveButton.prop("disabled", true)
	newButton.prop("disabled", false)
	copyButton.prop("disabled", false)

	viewCounter.text(views)

	editor.hide()
	codeViewPre.show()
	viewCounterLabel.show()
}

saveButton.click(function () {
	if (editor.val() === "") {
		return
	}
	const val: string = editor.val()?.toString()!

	postPaste(val, function (err, res) {
		if (err) {
			addMessage(err["data"]["message"])
		} else {
			window.history.pushState(null, "", `/~/${res["data"]["id"]}`)

			rawContent = res["data"]["content"]

			viewPaste(rawContent, "0")
		}
	})
})

copyButton.click(function () {
	//TODO: Make copy paste to new paste
	// const path = window.location.pathname;
	// const split = path.split("/");
	// const id = split[split.length - 1];
	// getPaste(id, function (err, res) {
	// 	if (err) {
	// 		window.history.pushState(null, null, `/`);
	// 		newPaste();
	// 	} else {
	// 		navigator.clipboard.writeText(res["data"]["content"])
	// 		addMessage("Copied paste to clipboard!")
	// 	}
	// });

	window.history.pushState(null, null, `/`)

	let content = rawContent
	newPaste()
	rawContent = content

	editor.val(rawContent)
})

editor.keydown(function (e: KeyboardEvent) {
	if (e.key == "Tab") {
		e.preventDefault()
		let start: string = this.selectionStart
		let end: string = this.selectionEnd
		this.value =
			this.value.substring(0, start) + "\t" + this.value.substring(end)
		this.selectionStart = this.selectionEnd = start + 1
	}
})

function handlePopstate() {
	const path = window.location.pathname

	if (path == "/") {
		newPaste()
	} else {
		const split = path.split("/")

		const id = split[split.length - 1]

		getPaste(id, function (err, res) {
			if (err) {
				window.history.pushState(null, "", `/`)
				newPaste()
			} else {
				rawContent = res["data"]["content"]
				viewPaste(rawContent, res["data"]["views"].toString())
			}
		})
	}
}

$(window).bind("popstate", function () {
	handlePopstate()
})

$(document).ready(function () {
	handlePopstate()
})
