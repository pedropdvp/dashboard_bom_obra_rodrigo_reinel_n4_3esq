"""Redraw the figures that changed after the proposal deck was generated
(price, number of bathrooms/divisions, share capital) directly on the slide images."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFont

FONTS = os.path.join(os.path.dirname(__file__), 'fonts')
INTER = os.path.join(FONTS, 'Inter-Regular.otf')
RALEWAY = os.path.join(FONTS, 'raleway-latin-600-normal.woff')
RC = os.path.join(FONTS, 'roboto-condensed-latin-400-normal.woff')
RC_BOLD = os.path.join(FONTS, 'roboto-condensed-latin-800-normal.woff')


def font_for_width(path, sample, width):
    """Font size at which `sample` renders `width` px wide (matches the original lettering)."""
    lo, hi = 4.0, 400.0
    for _ in range(30):
        mid = (lo + hi) / 2
        b = ImageFont.truetype(path, mid).getbbox(sample)
        lo, hi = (mid, hi) if b[2] - b[0] < width else (lo, mid)
    return ImageFont.truetype(path, lo)


def erase(im, box, sample_y):
    """Fill box column by column with the colour found at row sample_y (keeps horizontal gradients)."""
    a = np.asarray(im).copy()
    x0, y0, x1, y1 = box
    a[y0:y1, x0:x1] = a[sample_y, x0:x1][None, :, :]
    im.paste(Image.fromarray(a))


def swap(im, box, s, font, fill, sample_y, light):
    """Replace the glyphs inside box with s, keeping their left edge and baseline."""
    lum = np.asarray(im.crop(box)).astype(int).mean(axis=2)
    ys, xs = np.where(lum > 180 if light else lum < 110)
    left, bottom = box[0] + xs.min(), box[1] + ys.max()
    erase(im, box, sample_y)
    b = font.getbbox(s, anchor='ls')
    text(im, (left - b[0], bottom - b[3] + 1), s, font, fill)


def text(im, xy, s, font, fill, anchor='ls'):
    ImageDraw.Draw(im).text(xy, s, font=font, fill=fill, anchor=anchor)


def slide1(im):
    f = font_for_width(INTER, 'Lavandaria e 3 Casas de Banho.', 484 - 80)
    swap(im, (247, 482, 266, 511), '4', f, (246, 251, 255), 515, True)


def slide2(im):
    f = font_for_width(RALEWAY, '3 Casas de Banho:', 1291 - 1093)
    swap(im, (1090, 406, 1104, 429), '4', f, (21, 28, 43), 404, False)


def slide4(im):
    src = im.copy()
    # clean paper texture from the empty left margin, mirrored across the slide
    strip = src.crop((0, 0, 240, 768))
    for i, x in enumerate(range(0, 1376, 240)):
        im.paste(strip if i % 2 == 0 else strip.transpose(Image.FLIP_LEFT_RIGHT), (x, 0))
    big = ImageFont.truetype(INTER, 880)
    text(im, (688, 384), '4', big, (227, 227, 225), anchor='mm')
    for box in ((243, 245, 521, 523), (550, 245, 828, 523), (856, 245, 1134, 523)):
        im.paste(src.crop(box), box[:2])
    t = font_for_width(INTER, '3 Casas de Banho: O Desafio da Harmonia', 1100 - 274)
    text(im, (687, 140), '4 Casas de Banho: O Desafio da Harmonia', t, (4, 4, 4), anchor='ms')
    lines = ['Uma intervenção integral nas quatro instalações sanitárias do apartamento.',
             'Da demolição inicial ao detalhe do acabamento final, o nosso processo garante uma',
             'linguagem estética coerente, aliada à mais alta eficiência técnica em toda a casa.']
    p = font_for_width(INTER, lines[1], 1107 - 269)
    for line, y in zip(lines, (598, 625, 652)):
        text(im, (688, y), line, p, (12, 12, 11), anchor='ms')


def slide10(im):
    f = font_for_width(RC, 'Entrada', 683 - 589)
    swap(im, (784, 182, 802, 211), '4', f, (96, 102, 105), 178, False)
    b = font_for_width(RC, 'Um projeto transversal que engloba 5 divisões distintas, desde a infraestrutura pesada', 1205 - 173)
    swap(im, (603, 664, 621, 694), '7', b, (245, 250, 253), 660, True)


def slide11(im):
    erase(im, (415, 316, 958, 440), 310)
    f = font_for_width(RC_BOLD, '45.000€', 948 - 423)
    text(im, (686, 431), '49.990€', f, (16, 45, 72), anchor='ms')
    b = font_for_width(RC, 'acabamento nas 5 divisões', 1249 - 1048)
    swap(im, (1174, 514, 1189, 533), '7', b, (16, 16, 15), 535, False)


def slide12(im):
    f = font_for_width(INTER, '519 525 825', 883 - 725)
    swap(im, (720, 552, 790, 586), '1.000€', f, (246, 250, 253), 592, True)


PATCHES = {1: slide1, 2: slide2, 4: slide4, 10: slide10, 11: slide11, 12: slide12}


def apply(n, im):
    if n in PATCHES:
        PATCHES[n](im)
    return im
