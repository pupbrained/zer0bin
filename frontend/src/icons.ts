import {
	SaveOutlined,
	FileAddOutlined,
	GithubOutlined,
	CopyOutlined,
	ForkOutlined,
	HeartOutlined,
	StarOutlined,
	EyeOutlined,
	EyeInvisibleOutlined,
	FireOutlined,
} from "@ant-design/icons-svg"
import { renderIconDefinitionToSVGElement } from "@ant-design/icons-svg/es/helpers"
import tippy from "tippy.js"
import "../style/tooltip.scss"
import "tippy.js/animations/scale.css"

const saveButton = <HTMLButtonElement>document.getElementById("save-button")
const newButton = <HTMLButtonElement>document.getElementById("new-button")
const copyButton = <HTMLButtonElement>document.getElementById("copy-button")
const hideButton = <HTMLButtonElement>document.getElementById("hide-button")
const githubButton = <HTMLButtonElement>document.getElementById("github-button")
const singleViewButton = <HTMLButtonElement>(
	document.getElementById("single-view-button")
)

const extraSVGAttrs = {
	width: "1em",
	height: "1em",
	fill: "currentColor",
}

saveButton.innerHTML += renderIconDefinitionToSVGElement(SaveOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})
newButton.innerHTML += renderIconDefinitionToSVGElement(FileAddOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})
copyButton.innerHTML += renderIconDefinitionToSVGElement(CopyOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})
githubButton.innerHTML += renderIconDefinitionToSVGElement(GithubOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})
hideButton.innerHTML += renderIconDefinitionToSVGElement(EyeInvisibleOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})
singleViewButton.innerHTML += renderIconDefinitionToSVGElement(FireOutlined, {
	extraSVGAttrs: extraSVGAttrs,
})

tippy("#save-button", {
	content: "Save paste<br><span class='keybind'>Ctrl + S</span>",
	placement: "bottom",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

tippy("#single-view-button", {
	content:
		"Single view<br><span class='keybind'>Deletes after seen 👻</span>",
	placement: "bottom",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

tippy("#new-button", {
	content: "New paste<br><span class='keybind'>Ctrl + N</span>",
	placement: "bottom",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

tippy("#copy-button", {
	content: "Duplicate paste<br><span class='keybind'>Ctrl + D</span>",
	placement: "bottom",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

tippy("#github-button", {
	content: `GitHub<br><span class='keybind'>
	${renderIconDefinitionToSVGElement(StarOutlined, {
		extraSVGAttrs: extraSVGAttrs,
	})} ${renderIconDefinitionToSVGElement(ForkOutlined, {
		extraSVGAttrs: extraSVGAttrs,
	})} ${renderIconDefinitionToSVGElement(HeartOutlined, {
		extraSVGAttrs: extraSVGAttrs,
	})}</span>`,
	placement: "bottom",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

tippy("#hide-button", {
	content: "Hide the button pane",
	placement: "top",
	animation: "scale",
	theme: "rosepine",
	allowHTML: true,
})

const observer = new MutationObserver(callback)

function callback() {
	let theme = ""

	if (window.location.pathname == "/") {
		theme = "rosepine"
	} else {
		theme = "rosepine-extended"
	}

	document.querySelectorAll("button").forEach(function (btn) {
		//@ts-ignore
		btn._tippy.setProps({ theme: theme })
	})
}

observer.observe(document.getElementById("code-view-pre"), {
	attributes: true,
})

export function toggleHiddenIcon(hidden: boolean) {
	if (!hidden) {
		hideButton.innerHTML = renderIconDefinitionToSVGElement(
			EyeInvisibleOutlined,
			{
				extraSVGAttrs: extraSVGAttrs,
			}
		)
	} else {
		hideButton.innerHTML = renderIconDefinitionToSVGElement(EyeOutlined, {
			extraSVGAttrs: extraSVGAttrs,
		})
	}
}
