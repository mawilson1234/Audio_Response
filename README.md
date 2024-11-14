# Open response to auditory stimulus task for CGSC/LING 496/696 at University of Delaware

This is a PCIbex implementation of an experiment where participants type a response to an auditory stimulus. For half of the participants, there will be a distractor digit recall task flanking the auditory response trials. The experimental stimuli to be presented should be entered into `chunk_includes/stimuli.csv`, and audio files should be included there as well in `.mp3` format. The experiment records responses, response times, and condition labels for all stimuli.

`preprocess.r` is an R script that will preprocess the raw results from PCIbex into an easier-to-use format.

This experiment is currently used as part of CGSC/LING 496/696 (Wilson) at the University of Delaware. It is distributed under the GNU General Public License v3.0.