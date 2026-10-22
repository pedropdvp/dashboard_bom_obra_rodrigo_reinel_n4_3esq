import sys, os
from PIL import Image, ImageDraw
M, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT+'/slides', exist_ok=True)
slide_img = {1:'image1',2:'image3',3:'image4',4:'image5',5:'image6',6:'image7',7:'image8',8:'image9',9:'image10',10:'image11',11:'image12',12:'image13',13:'image14'}
def load(n):
    im = Image.open(f'{M}/{slide_img[n]}.png').convert('RGB')
    # cover the generator watermark (bottom-right), as the original deck does
    im.paste(im.crop((1138, 740, 1256, 766)), (1258, 740))
    return im
def save(im, name, q=84): im.save(f'{OUT}/{name}.jpg', quality=q, optimize=True, progressive=True)
for n in range(1, 14): save(load(n), f'slides/slide{n:02d}', 80)
save(load(1).crop((600, 0, 1376, 738)), 'hero_torneira')
p = load(2); ImageDraw.Draw(p).rectangle([70, 55, 395, 170], fill=p.getpixel((60, 200)))
save(p.crop((60, 20, 1320, 632)), 'planta_iso')
save(load(3).crop((0, 0, 688, 768)), 'entrada_parede')
s4 = load(4)
for i, x in enumerate((260, 567, 873)): save(s4.crop((x, 262, x + 243, 505)), f'wc_foto{i+1}')
save(load(5).crop((475, 200, 902, 672)), 'wc_corte')
s6 = load(6)
cells = [(205,210,355,350),(610,210,765,350),(1000,240,1195,335),(215,475,345,625),(630,475,745,625),(1030,485,1160,615)]
for i, b in enumerate(cells): save(s6.crop(b), f'icone{i+1}', 90)
save(load(7).crop((440, 60, 1318, 708)), 'cozinha_foto')
save(load(8).crop((305, 245, 1102, 648)), 'cozinha_equip')
save(load(9).crop((430, 185, 948, 505)), 'lavandaria')
save(load(13).crop((0, 0, 1376, 738)), 'sala_fundo')
