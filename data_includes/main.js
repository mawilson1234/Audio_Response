// This is a PCIbex implementation of a simple audio response task for
// CGSC/LING 496/696 @ University of Delaware

// Michael Wilson, November 2024
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

var answer_style = {
	'text-align': 'justify', 
	margin: '0 auto', 
	'margin-bottom': '2em',
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
		"<p>Welcome! In this experiment, you will hear an audio recording of a word. " +
		"After hearing a word, you will be shown four options, and you should choose " +
		"the one that corresponds to the word you heard.</p>" + 
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
		
		newAudio('audio', currentrow.audio_file + '.mp3')
			.once()
			.play()
			.wait()
		,
		
		getText('interact')
			.remove()
		,
		
		newText(
			'prompt', 
			'Which word did you hear? (Click to answer.)'
		)
			.css(prompt_style)
			.print()
		,
		
		newText(currentrow.first_answer, currentrow.first_answer)
			.css(answer_style)
			.print()
		,
		
		newText(currentrow.second_answer, currentrow.second_answer)
			.css(answer_style)
			.print()
		,
		
		newText(currentrow.third_answer, currentrow.third_answer)
			.css(answer_style)
			.print()
		,
		
		newText(currentrow.fourth_answer, currentrow.fourth_answer)
			.css(answer_style)
			.print()
		,
		
		newVar('RT')
			.global()
			.set(v => Date.now())
		,
		
		newSelector('answer')
			.add(
				getText(currentrow.first_answer), 
				getText(currentrow.second_answer), 
				getText(currentrow.third_answer),
				getText(currentrow.fourth_answer)
			)
			.shuffle()
			.wait()
			.log()
		,
		
		getVar('RT')
			.set(v => Date.now() - v)
	)
		.log('item', currentrow.item)
		.log('audio_file', currentrow.audio_file)
		.log('first_answer', currentrow.first_answer)
		.log('second_answer', currentrow.second_answer)
		.log('third_answer', currentrow.third_answer)
		.log('fourth_answer', currentrow.fourth_answer)
		.log('correct_answer', currentrow.correct_answer)
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