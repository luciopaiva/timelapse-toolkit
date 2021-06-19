
# Timelapse toolkit

Collection of scripts to help turn a sequence of images into an animation.

My current workflow uses Aseprite with my [timelapse plugin](https://github.com/luciopaiva/aseprite-timelapse) and my [hotkey automator](https://github.com/luciopaiva/hotkey-repeat) to generate the sequence of images.

To turn the images into an animation, Aseprite could be used. It is able to handle thousands of images with no problem (light-years ahead of Photoshop in terms of processing time!), but it is not free of problems. I have problems when I switch from an RGB palette to an indexed one as I developed my art. Aseprite just fails when it notices the palette change. It also has weird problems even with an indexed palette right from the beginning, in case you change the colors along the way.

To circumvent that, I resorted to ImageMagick, which is capable of generating animated gifs from pngs. I just had to rename files so that they all had the same number of digits in the sequence, otherwise the order of the frames got messed (ordered lexicographically). To do the renaming, I wrote `prefix-with-zeros.js` (see below).

One other interesting thing is recognizing and removing repeated frames. The way my Aseprite script works, it is not able to detect whether there was any actual changes to the art. It is technically possible to do that in Lua, but the Aseprite Lua implementation is very restricted and it'd be something difficult to do, so I decided to do it after the art is finished using Node.js. For this task, see `drop-duplicates.js`.

If any files were deleted after `drop-duplicates.js`, now there will be holes in the sequence. To fix the holes, use `fix-holes.js`. I decided to keep this fix as a separate script in order to be able to run it independently, as there can be other reasons for holes to appear (like manually deleting files). Sure, `drop-duplicates.js` can automatically call `fix-holes.js` at some point.  

It is interesting that the final gif holds a bit the last frame, which shows the finished art, before starting all over. To do that, we have to repeat the last frame. That's what `repeat-last.js` is for.

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

Runs through the files in sequence, checking where file i+1 is an exact copy of i, when i+1 is then discarded.

## fix-holes.js

    node fix-holes <path-to-timelapse-files>

This script will renumber files in the sequence to fix any eventual holes. It will preserve any existing zero-padding.

If the number of holes removed allows for a reduction in the padding of the sequence, the script will perform the reduction. For instance, the last image was sequenced as `1345`, but it is now `0876`, the leading zero can be dropped in all images.

## remove-padding.js

    node remove-padding <path-to-timelapse-files>

This will simply remove any padding added to the sequence numbers in the images.

## repeat-last.js

    node repeat-last <path-to-timelapse-files> <times>

This is so the animation holds the last frame for longer. Aseprite is able to adjust the duration of each frame individually, so it would be easy to adjust the last one. The problem is that Twitter seems to ignore that seeting (and I can confirm it is Twitter, because the Windows player does respect the duration).

## cover.js

    node cover <path-to-timelapse-files>

This scripts copies the last frame to the first one, moving all other frames one sequence up to accommodate for that.
