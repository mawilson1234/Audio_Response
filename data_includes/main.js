// This is a PCIbex implementation of a simple self-paced reading task for
// CGSC/LING 496/696 @ University of Delaware

// Michael Wilson, November 2024
// CC-BY

PennController.ResetPrefix(null) // Shorten command names (keep this)
DebugOff()

// about half should do the digit recall task
var digit_recall = Math.random() > 0.5 ? true : false
var instructions = digit_recall ? 'instructions_dr' : 'instructions'
var digit_recall_trial_1 = digit_recall ? 'digit_recall_1' : 'blank'
var digit_recall_trial_2 = digit_recall ? 'digit_recall_2' : 'blank'
var cognitive_load = digit_recall ? 'high' : 'low'

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
	'demographics',
	instructions,
	'preload',
	'preloaded',
	digit_recall_trial_1,
	randomize('trial'),
	digit_recall_trial_2,
	SendResults(),
	'end'
)

newTrial('demographics',
	fullscreen()
	,
	
	newHtml('demographics', 'background.html')
		.css(centered_justified_style)
		.radioWarning("You must select an option for '%name%'.")
		.inputWarning("You must provide an answer for '%name'.")
		.print()
		.log()
	,
	
	newButton('Next', 'Next')
		.css('font-family', 'Helvetica, sans-serif')
		.css('font-size', '16px')
		.center()
		.print()
		.wait(
			getHtml('demographics')
				.test.complete()
				.failure(
					getHtml('demographics').warn()
				)
		)
).setOption('countsForProgressBar', false)

newTrial('instructions',
	fullscreen(),
	
	newText(
		"<p>Welcome! In this experiment, you will hear audio recordings of three people " +
		"speaking all at once. The speakers will each say a word followed by a number. " +
		"Your task is to listen for the speaker who says the word 'alpha,' and type the " +
		"number that speaker says after saying 'alpha'.</p>" + 
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

newTrial('instructions_dr',
	fullscreen(),
	
	newText(
		"<p>Welcome! In this experiment, you will be asked to complete two tasks. " +
		"First, you will hear a speaker say a sequence of numbers. You should try your best to " +
		"remember this sequence of numbers. Please do not write down the sequence, since part of the point " +
		"of this experiment is to study how human memory works.</p>" +
		"<p>After you hear the list of numbers that you should try to remember, you will do a " +
		"second task. In this task, you will hear audio recordings of three people " +
		"speaking all at once. The speakers will each say a word followed by a number. " +
		"Your task is to listen for the speaker who says the word 'alpha,' and type the " +
		"number that speaker says after saying 'alpha'.</p>" +
		"<p>Once you have finished all trials for the second task, you will then be asked " +
		"to recall the sequence of numbers you heard at the beginning of the experiment.</p><p>" +
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

newTrial('blank')

newTrial('digit_recall_1',
	newText('interact', 'Press space to play the audio.')
		.css(centered_justified_style)
	,
	
	newKey('start', ' ')
		.wait()
	,
	
	newAudio('audio', 'LING 696 Audio 13.mp3')
		.once()
		.play()
		.wait()
	,
	
	getText('interact')
		.remove()
	,
	
	newVar('RT')
		.global()
		.set(v => Date.now())
	,
	
	newText(
		'prompt', 
		"Click below when you are ready to continue to the second task. Try to remember the numbers you just heard!"
	)
		.css(prompt_style)
		.print()
	,
	
	newButton('Next','Next')
		.center()
		.print()
		.wait()
)

Template('stimuli.csv', currentrow =>
	newTrial(
		'trial',
		
		newText('interact', 'Press space to play the audio.')
			.css(centered_justified_style)
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
		
		newVar('RT')
			.global()
			.set(v => Date.now())
		,
		
		newText(
			'prompt', 
			"What number did the speaker who said 'alpha' say? (Press 'enter' when you are done.)"
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
		,
		
		getVar('RT')
			.set(v => Date.now() - v)
	)
		.log('item', currentrow.item)
		.log('audio_file', currentrow.audio_file)
		.log('target_speaker', currentrow.target_speaker)
		.log('target_number', currentrow.target_number)
		.log('response_time', getVar('RT'))
		.log('cognitive_load', cognitive_load)
)

newTrial(
	'digit_recall_2',
	
	newVar('RT')
		.global()
		.set(v => Date.now())
	,
	
	newText(
		'prompt', 
		"You have now finished with the second task. " +
		"Below, do your best to enter the sequence of " +
		"numbers you recall having heard at the beginning " +
		"of the experiment. (Press 'enter' when you are done.)"
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
	,
	
	getVar('RT')
		.set(v => Date.now() - v)
)
	.log('response_time', getVar('RT'))
	.log('cognitive_load', cognitive_load)


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