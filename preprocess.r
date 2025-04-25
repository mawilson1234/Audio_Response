library(tidyverse)
library(data.table)

# User-defined function to read in PCIbex Farm results files
read.pcibex <- function(
	filepath, 
	colnames.from,
	auto.colnames = TRUE, 
	fun.col = \(col, cols) {
			cols[cols == col] <- paste(col, 'Ibex', sep = '.')
			return (cols)
		}
	) {
	
	get.colnames <- function(filepath) {
		cols <- c()
		con <- file(filepath, 'r')
		while (TRUE) {
			line <- readLines(con, n = 1, warn = FALSE)
			if (length(line) == 0) {
				break
			}
			
			m <- regmatches(line, regexec(r'(^# (\d+)\. (.+)\.,*?$)', line))[[1]]
			if (length(m) == 3) {
				index <- as.numeric(m[2])
				value <- m[3]
				if (is.function(fun.col)) {
					cols <- fun.col(value, cols)
				}
				cols[index] <- value
				if (index == n.cols) {
					break
				}
			}
		}
		close(con)
		
		return (cols)
	}
	
	n.cols <- max(count.fields(filepath, sep = ',', quote = NULL), na.rm = TRUE)
	if (auto.colnames) {
		cols <- get.colnames(filepath)
		
		# this happens due to a data coding errors we've fixed
		if (is.null(cols)) {
			cols <- get.colnames(colnames.from)
		}
		
		return (read.csv(filepath, comment.char = '#', header = FALSE, col.names = cols))
	}
	else {
		return (read.csv(filepath, comment.char = '#', header = FALSE, col.names = seq_len(n.cols)))
	}
}

df <- read.pcibex('results.csv') |>
	as_tibble() |>
	mutate(
		participant = paste0(Results.reception.time, MD5.hash.of.participant.s.IP.address),
		participant = match(participant, unique(participant))
	) |>
	select(-Results.reception.time, -MD5.hash.of.participant.s.IP.address) |>
	select(participant, everything())

demographics <- df |>
	filter(grepl('^demographics', Parameter)) |>
	select(participant, Parameter, Value) |>
	mutate(Parameter = gsub('^demographics_', '', Parameter)) |>
	pivot_wider(
		names_from = Parameter,
		values_from = Value
	) |>
	mutate(
		across(everything(), trimws),
		participant = as.numeric(participant)
	)

demographics |>
	fwrite('demographics.csv', row.names = FALSE)

df <- df |>
	filter(
		PennElementType == 'Selector',
		Parameter == 'Selection'
	) |>
	select(
		participant, Value,
		item:response_time
	) |>
	rename(response = Value) |>
	mutate(
		accent = gsub('^(.*?)_(.*?)$', '\\2', audio_file),
		correct_answer = gsub('^(.*?)_(.*?)$', '\\1', audio_file),
		response = case_when(
			response == 'first_answer' ~ first_answer,
			response == 'second_answer' ~ second_answer,
			response == 'third_answer' ~ third_answer,
			response == 'fourth_answer' ~ fourth_answer
		),
		response_accuracy = as.numeric(response == correct_answer)
	) |>
	left_join(demographics) |>
	select(
		participant, nativelanguage, gender, liveearly, livecurrent,
		item, accent, correct_answer, response, response_time, response_accuracy,
		everything()
	)

df |>
	fwrite('cleaned_results.csv', row.names = FALSE)