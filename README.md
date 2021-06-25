
# Timelapse toolkit

Collection of scripts to help turn a sequence of images into an animation.

List of scripts:

- [prefix-with-zeros.js](#prefix-with-zerosjs)
- [drop-duplicates.js](#drop-duplicatesjs)
- [fix-holes.js](#fix-holesjs)
- [remove-padding.js](#remove-paddingjs)
- [repeat-last.js](#repeat-lastjs)
- [cover.js](#coverjs)
- [elapsed.js](#elapsedjs)
- [one-every.js](#one-everyjs)

My current workflow uses [Aseprite](https://github.com/aseprite/aseprite) with my [timelapse plugin](https://github.com/luciopaiva/aseprite-timelapse) and my [hotkey automator](https://github.com/luciopaiva/hotkey-repeat) to generate a sequence of images. That is, however, just a suggestion of workflow. As long as you end up with a sequence of images like `0.png`, `1.png`, `2.png`, and so on, this toolkit can help you generate and animated gif. 

To actually turn the final sequence of images into an animation, Aseprite is recommended here. It is able to handle thousands of images with no problem (light-years ahead of Photoshop in terms of processing time!), but it is not free of problems. For example, I have problems when I switch from an RGB palette to an indexed one as I developed my art. Aseprite fails when it notices the palette change. It also has problems even with an indexed palette right from the beginning, in case you change the colors along the way.

To circumvent that, I resorted to ImageMagick, which is capable of generating animated gifs from pngs. I just had to rename files so that they all had the same number of digits in the sequence number written in the file name, otherwise the order of the frames gets messed up (i.e., ordered lexicographically). To do the renaming, I wrote `prefix-with-zeros.js` (see below).

One other interesting thing is recognizing and removing repeated frames. The way my Aseprite script works, it is not able to detect whether there was any actual changes to the art. It is technically possible to do that in Lua, but the Aseprite Lua implementation is very restricted, and it'd be something difficult to do, so I decided to do it after the art is finished using Node.js. For this task, see `drop-duplicates.js`.

If any files were deleted after `drop-duplicates.js`, now there will be holes in the sequence. To fix the holes, use `fix-holes.js`. I decided to keep this fix as a separate script in order to be able to run it independently, as there can be other reasons for holes to appear (like manually deleting files). Sure, `drop-duplicates.js` can automatically call `fix-holes.js` at some point.

If the work took many hours to be completed and a short period between snapshots was used, in the end there may be way too many frames in the final animation, making it too lengthy. If that's the case, use `one-every.js` to remove a few frames. For a timelapse of 8 hours of work with a period of 5 seconds between snapshots, keeping only 1 out of every 4 snapshots is a good setting.

Speaking of the duration, given that snapshots were regularly taken while the work was being performed, we can use the timestamps of the files to figure out how long it took for the work to be completed. For that, use `elapsed.js`.

It is interesting to keep the last frame showing for a few seconds on the screen, before the animation starts over. To do that, we could either extend the duration of the last frame or repeat the last frame a few times. I tried extending the duration and it works fine in some players, but Twitter seems to not respect that. So the solution I adopted was to just repeat the last frame. That's what `repeat-last.js` is for. I usually ask it to repeat 30 times, which seems to be a good duration.

It is also interesting that the first frame be a copy of the finished art, so it shows something nice in case the animation is stopped. Use `cover.js` for that.

Finally, this is how I use ImageMagick to generate the final animated gif:

    magick convert -set delay 1 -colors 256 -loop 0 *.png output.gif

Once the animation file is ready, I open it in Aseprite to do a final crop and export with 400% resize for sharing in social media.

One last script is `remove-padding.js`, which serves as an antidote for `prefix-with-zeros.js`, in case it is necessary to revert the operation (e.g.: to continue working on the art, or to ask Aseprite to generate a gif, because Aseprite does not like padded sequences).

References:

- [Nearest neighbour interpolation not working in ImageMagick](https://graphicdesign.stackexchange.com/q/41188)
- [ImageMagick: animation basics](https://legacy.imagemagick.org/Usage/anim_basics/)

## prefix-with-zeros.js

    node prefix-with-zeros <path-to-timelapse-files>

Given a numbered file sequence where the numbers are not prefixed with zeros, this script calculates the minimum number of zeros necessary so that all files have the same number of digits. For example:

- 0.png
- 1.png
- ...
- 123.png
- 124.png

Would be renamed to:

- 000.png
- 001.png
- ...
- 123.png
- 124.png

This is necessary for some programs like ImageMagick to order a sequence of images properly. On the other hand, the program that generates the files may not know beforehand how many files will be generated (and thus how much padding is needed), so a script like this is useful.

## drop-duplicates.js

    node drop-duplicates <path-to-timelapse-files>

Runs through the files in sequence, checking where file i+1 is an exact copy of i, when i+1 is then discarded. Needs files to be prefixed with zeros, otherwise they will be incorrectly sorted.

## fix-holes.js

    node fix-holes <path-to-timelapse-files>

This script will renumber files in the sequence to fix any eventual holes. It will preserve any existing zero-padding.

If the number of holes removed allows for a reduction in the padding of the sequence, the script will perform the reduction. For instance, the last image was sequenced as `1345`, but it is now `0876`, the leading zero can be dropped in all images.

Warning: it needs files to be prefixed with zeros, otherwise they will be incorrectly sorted!

## remove-padding.js

    node remove-padding <path-to-timelapse-files>

This will simply remove any padding added to the sequence numbers in the images.

## repeat-last.js

    node repeat-last <path-to-timelapse-files> <times>

This is so the animation holds the last frame for longer. Aseprite is able to adjust the duration of each frame individually, so it would be easy to adjust the last one. The problem is that Twitter seems to ignore that seeting (and I can confirm it is Twitter, because the Windows player does respect the duration).

## cover.js

    node cover <path-to-timelapse-files>

This scripts copies the last frame to the first one, moving all other frames one sequence up to accommodate for that. Needs files to be prefixed with zeros, otherwise they will be incorrectly sorted.

## elapsed.js

    node elapsed <path-to-timelapse-files>

Calculates how much time was spent doing the art. Needs files to be prefixed with zeros, otherwise they will be incorrectly sorted.

For it to work properly, snapshots have to be taken regularly. The script orders snapshots by their sequence numbers and considers gaps of up to 5 min between snapshots as work done. Conversely, if the gap between two snapshots is greater than 5 min, that time is not counted (the script considers the work was paused).

## one-every.js

    node elapsed <path-to-timelapse-files> <x>

Sometimes you just have too many snapshots. This script allows you to keep one out of every `x` snapshots. Files will be deleted, holes need to be fixed with `fix-holes.js`.
