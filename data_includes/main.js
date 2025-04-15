// This is a PCIbex implementation of a gated audio response task for
// CGSC/LING 496/696 @ University of Delaware

// Michael Wilson, April 2025
// CC-BY

PennController.ResetPrefix(null) // Shorten command names (keep this)
DebugOff()

var centered_justified_style = {
	'text-align': 'justify', 
	margin: '0 auto', 
	'margin-bottom': '3em',
	width: '30em'
}

var prompt_style = {
	'text-align': 'justify', 
	margin: '0 auto',
	'margin-top': '3em',
	'margin-bottom': '0.5em',
	width: '30em'
}

Sequence(
	'instructions',
	'preload',
	'preloaded',
	randomize('trial'),
	SendResults(),
	'end'
)

newTrial('instructions',
	newText(
		"<p>Welcome! In this experiment, you will hear audio recordings of words. " +
		"Each audio recording will play only part of the word at first, but it will repeat. " +
		"With each repetition, more of the word will be audible. " +
		"As soon as you think you've identified what the word being played is, even if you " +
		"haven't heard the complete word, you should press the <b>space bar</b>. When you do, " +
		"the audio will stop playing, and you will see a text box where you should type in " +
		"word you heard. Once you type in the word and press 'Enter,' you will go on to the " +
		"next trial.</p>" +
		"<p><b>You should wear headphones for this experiment.</b> If you do not have " +
		"headphones on now, please put some on before continuing. If you do not have access " +
		"to headphones, please close this tab, and do not participate in this experiment.</p>"
	)
		.css(centered_justified_style)
		.print()		
	,
	
	newButton('Click when you are ready to begin')
		.css('font-family', 'Helvetica, sans-serif')
		.css('font-size', '16px')
		.center()
		.print()
		.wait()
).setOption('countsForProgressBar', false)

CheckPreloaded('trial')
	.label('preload')

newTrial('preloaded',
	newText('The audio has finished preloading. Click below when you are ready to begin the experiment.')
		.css(centered_justified_style)
		.print()
	,
	
	newButton('Click when you are ready to begin')
		.css('font-family', 'Helvetica, sans-serif')
		.css('font-size', '16px')
		.center()
		.print()
		.wait()
)

Template('stimuli.csv', currentrow =>
	newTrial(
		'trial',
		
		newText('interact', 'Press space to play the audio.')
			.center()
			.print()
		,
		
		newKey('start', ' ')
			.wait()
		,
		
		newVar('RT')
			.global()
			.set(v => Date.now())
		,
		
		newAudio('audio', currentrow.audio_file + '.mp3')
			.once()
			.play()
		,
		
		getText('interact')
			.remove()
		,
		
		newText('interact2', 'Press space when you are ready to respond.')
			.center()
			.print()
		,
		
		newKey('end', ' ')
			.wait()
		,
		
		getVar('RT')
			.set(v => Date.now() - v)
		,
		
		getText('interact2')
			.remove()
		,
		
		getAudio('audio')
			.stop()
		,
		
		newText(
			'prompt', 
			"What word did you hear?"
		)
			.css(prompt_style)
			.print()
		,
		
		newTextInput('response')
			.css(centered_justified_style)
			.log()
			.lines(1)
			.print()
			.wait()
	)
		.log('item', currentrow.item)
		.log('audio_file', currentrow.audio_file)
		.log('word', currentrow.word)
		.log('response_time', getVar('RT'))
)

newTrial('end',
	exitFullscreen()
	,
	
	newText('This is the end of the experiment; you can now close this window. Thank you!')
		.css(centered_justified_style)
		.center()
		.print()
	,
	
	newButton()
		.wait()
)
.setOption('countsForProgressBar', false)