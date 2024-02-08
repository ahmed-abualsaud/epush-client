<script>
	import { onMount } from "svelte"
	import { empty } from "$lib/helper/utils"
	import { Settings } from "$lib/helper/settings"
	import { getSettingsValueByName } from "../../api/settings"
	import { findSimilarWords, countSubstringOccurrences } from "$lib/helper/strUtils"

	export let html = ""
	export let text = ""
	export let clazz = ""
	export let onInput = null
	export let onKeyDown = null
	export let textarea = null
	export let censoredWords = []
	export let autofillOptions = []
	export let censoredOcurrence = []
	export let censoredWordsNames = []
	export let textInputFilter = null
	export let onEnteringOption = null
	export let optionsOcurrence = Array(autofillOptions.length).fill(0)

	let autofillTop = 0
	let autofillLeft = 0
	let filterThreshold = 99
	let showAutofill = false 

	onMount(async () => {
		html = ""
		optionsOcurrence = []
		censoredOcurrence = censoredWords.map(word => ({word, count: 0}))
		filterThreshold = await getSettingsValueByName(Settings.WORD_FILTER_THRESHOLD)

		onEnteringOption = (opt, idx) => {
			optionsOcurrence[idx]++
			showAutofill = false
			addOption("{{" + opt + "}}")
			text = generateTextFromHtml(html)
			onInput && onInput(text)
		}
	})

	const saveCursorPosition = (element) => {
		var range = document.createRange()
		range.selectNodeContents(element)
		range.collapse(false)
		var selection = window.getSelection()
		selection.removeAllRanges()
		selection.addRange(range)
	}

	const generateTextFromHtml = () => {
		let temp = document.createElement('div')
		temp.innerHTML = html

		let result = ''
		for (let i = 0; i < temp.childNodes.length; i++) {
			result += parseNodes(temp.childNodes[i])
		}

		if (result == '\n') {
			return ""
		}

		return result
	}

	const parseNodes = (node) => {
		let result = ''
		if (node.nodeType === Node.ELEMENT_NODE) {
			if (node.tagName === 'DIV') {
				result += '\n' + node.innerText
			} else if (node.tagName === 'SPAN' || node.tagName === 'P') {
				result += node.innerText
			} else if (node.tagName === 'BR') {
				result += '\n'
			}
		} else if (node.nodeType === Node.TEXT_NODE) {
			result += node.nodeValue
		}
		return result
	}

	const styleCensoredWord = (word) => {
		let temp = document.createElement('div')
		temp.innerHTML = html

		let emptyText = document.createTextNode('\u00A0')
		let newSpan = document.createElement('span')
		newSpan.style.color = "#D92D20"
		newSpan.textContent = word

		if (empty(temp.lastChild) || empty(temp.innerHTML) || temp.innerHTML == "<br>" || temp.innerHTML.includes('<font')) {
			temp.innerHTML = "\u00A0"
			temp.appendChild(newSpan)
			temp.appendChild(emptyText)
			html = temp.innerHTML
			return
		}

		if (temp.lastChild.nodeType === Node.TEXT_NODE) {
			let textContent = temp.lastChild.textContent
			if (textContent.endsWith(word)) {
				temp.lastChild.textContent = textContent.slice(0, -word.length)
			}
			temp.lastChild.textContent += '\u00A0'

			temp.appendChild(emptyText)
			temp.appendChild(newSpan)
			temp.appendChild(emptyText)
		}

		if (temp.lastChild.nodeType === Node.ELEMENT_NODE && temp.lastChild.tagName.toLowerCase() === 'div') {
			if (temp.lastChild.lastChild.nodeName == "BR") {
				temp.lastChild.removeChild(temp.lastChild.lastChild)
				temp.lastChild.appendChild(document.createTextNode('\u00A0'))
			}

			if (temp.lastChild.lastChild.nodeType === Node.TEXT_NODE) {
				let textContent = temp.lastChild.lastChild.textContent
				if (textContent.endsWith(word)) {
					temp.lastChild.lastChild.textContent = textContent.slice(0, -word.length) + '\u00A0'
				}
			}
			temp.lastChild.appendChild(emptyText)
			temp.lastChild.appendChild(newSpan)
			temp.lastChild.appendChild(emptyText)
		}
		html = temp.innerHTML
		saveCursorPosition(document.body)
	}

	const addOption = (option) => {
		let temp = document.createElement('div')
		temp.innerHTML = html

		let emptyText = document.createTextNode('\u00A0')
		let newSpan = document.createElement('span')
		newSpan.style.color = "#0086C9"
		newSpan.textContent = option

		if (empty(temp.lastChild) || empty(temp.innerHTML) || temp.innerHTML == "<br>" || temp.innerHTML.includes('<font')) {
			temp.innerHTML = "\u00A0"
			temp.appendChild(newSpan)
			temp.appendChild(emptyText)
			html = temp.innerHTML
			return
		}

		if (temp.lastChild.nodeType === Node.TEXT_NODE) {
			let textContent = temp.lastChild.textContent
			if (textContent.endsWith('/')) {
				temp.lastChild.textContent = textContent.slice(0, -1)
			}
			temp.lastChild.textContent += '\u00A0'

			temp.appendChild(emptyText)
			temp.appendChild(newSpan)
			temp.appendChild(emptyText)
		}

		if (temp.lastChild.nodeType === Node.ELEMENT_NODE && temp.lastChild.tagName.toLowerCase() === 'div') {
			if (temp.lastChild.lastChild.nodeName == "BR") {
				temp.lastChild.removeChild(temp.lastChild.lastChild)
				temp.lastChild.appendChild(document.createTextNode('\u00A0'))
			}

			if (temp.lastChild.lastChild.nodeType === Node.TEXT_NODE) {
				let textContent = temp.lastChild.lastChild.textContent
				if (textContent.endsWith('/')) {
					temp.lastChild.lastChild.textContent = textContent.slice(0, -1) + '\u00A0'
				}
			}
			temp.lastChild.appendChild(emptyText)
			temp.lastChild.appendChild(newSpan)
			temp.lastChild.appendChild(emptyText)
		}
		html = temp.innerHTML
	}


	const enterOption = (option, index) => {
		onEnteringOption(option, index)
	}

	const onInputHandler = () => {
		for (let i = 0; i < autofillOptions.length; i++) {
			optionsOcurrence[i] = countSubstringOccurrences(text, "{{" + autofillOptions[i] + "}}")
		}

		let words = findSimilarWords(text, censoredWords, filterThreshold)
		if (! empty(words)) {
			let currentWord
			words.forEach(word => {
				currentWord = censoredOcurrence.find(wrd => wrd.word == word.blacklistedWord)
				if (! empty(currentWord)) {
					if (currentWord.count == 0) {
						styleCensoredWord(word.textWord)
						text = generateTextFromHtml(html)
					}
					currentWord.count += 1
				}
			})
		}

		censoredWordsNames = [...new Set(words.map(word => word.blacklistedWord))]
		censoredOcurrence.filter(word => ! censoredWordsNames.includes(word.word)).forEach(word => {
			word.count = 0
		})
		
		onInput && onInput(text)
	}

	const onKeyDownHandler = (e) => {
		const keyCode = e.keyCode || e.which
		const keyValue = String.fromCharCode(keyCode)
		showAutofill = keyCode === 191 ? true : false
		onKeyDown && onKeyDown(e, keyCode, keyValue)
		textInputFilter && textInputFilter(e)
	}

	const getCurrentPosition = () => {
		const selection = window.getSelection()
		if (selection.rangeCount > 0) {
			const selectRec = selection.getRangeAt(0).getBoundingClientRect()
			const textRect = textarea.getBoundingClientRect()
			autofillTop = selectRec.top - textRect.top + 30
			autofillLeft = selectRec.left - textRect.left + 20
		}
	}

	$: { text = generateTextFromHtml(html) }
</script>

<div class="relative flex items-start self-stretch flex-1 py-3 px-3.5 rounded-lg border border-gray-300 bg-white shadow-sm">
	<div
		class="flex-1 self-stretch text-gray-500 outline-none break-all {clazz}"
		role="textbox"
		tabindex={10}
		contenteditable
		bind:this={textarea}
		bind:innerHTML={html}
		on:input={onInputHandler}
		on:change={onInputHandler}
		on:keyup={getCurrentPosition}
		on:click={getCurrentPosition}
		on:keydown={onKeyDownHandler}
	></div>
	{#if showAutofill}
		<div class="hide-dropdown absolute flex flex-col items-start rounded-lg border border-gray-200 bg-white shadow-lg w-[200px]" style="top: {autofillTop}px; left: {autofillLeft}px;">
		{#if empty(autofillOptions)}
			<div class="flex items-center flex-1 py-[9px] px-2.5 rounded">
				<span class="flex-1 text-red-700 text-sm font-medium">NO OPTIONS</span>
			</div>
		{:else}
			{#each autofillOptions as option, index}
			<button on:click={() => enterOption(option, index)} class="flex items-center flex-1 self-stretch gap-3 my-1 mx-1.5 py-[9px] px-2.5 rounded-lg hover:bg-blue-50">
				<div class="flex items-center flex-1 gap-2">
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
						<g clip-path="url(#clip0_776_13360)">
							<path d="M7.99967 5.3335V10.6668M5.33301 8.00016H10.6663M14.6663 8.00016C14.6663 11.6821 11.6816 14.6668 7.99967 14.6668C4.31778 14.6668 1.33301 11.6821 1.33301 8.00016C1.33301 4.31826 4.31778 1.3335 7.99967 1.3335C11.6816 1.3335 14.6663 4.31826 14.6663 8.00016Z" stroke="#0BA5EC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</g>
						<defs>
							<clipPath id="clip0_776_13360">
								<rect width="16" height="16" fill="white"/>
							</clipPath>
						</defs>
					</svg>
					<span class="flex-1 text-start text-gray-700 text-sm font-medium">{option}</span>
				</div>
				<span class="text-gray-500 text-xs">{optionsOcurrence[index] > 0 ? optionsOcurrence[index] : ""}</span>
			</button>
			{/each}
		{/if}
		</div>
	{/if}
</div>

<svelte:window on:click={(e) => {
  if (e.target.closest(".hide-dropdown")) return 
  showAutofill = false
}}/>