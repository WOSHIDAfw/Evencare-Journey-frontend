"""Generate simple tab bar placeholder icons for uni-app."""
from PIL import Image, ImageDraw

SIZE = 81
GRAY = (153, 153, 153, 255)
GREEN = (1, 136, 77, 255)
TRANSPARENT = (0, 0, 0, 0)

ICONS = {
    "trip": "home",
    "navigator": "arrow",
    "wellness": "heart",
    "security": "shield",
    "account": "person",
}


def draw_home(draw, color):
    draw.polygon([(18, 38), (40, 18), (62, 38)], outline=color, width=3)
    draw.rectangle([24, 38, 56, 62], outline=color, width=3)


def draw_arrow(draw, color):
    draw.polygon([(40, 16), (58, 40), (48, 40), (48, 64), (32, 64), (32, 40), (22, 40)], outline=color, width=3)


def draw_heart(draw, color):
    draw.arc([18, 20, 40, 42], 180, 0, fill=color, width=3)
    draw.arc([40, 20, 62, 42], 180, 0, fill=color, width=3)
    draw.polygon([(20, 34), (40, 62), (60, 34)], outline=color, width=3)


def draw_shield(draw, color):
    draw.polygon([(40, 16), (62, 26), (62, 44), (40, 66), (18, 44), (18, 26)], outline=color, width=3)


def draw_person(draw, color):
    draw.ellipse([30, 14, 50, 34], outline=color, width=3)
    draw.arc([20, 38, 60, 68], 0, 180, fill=color, width=3)


DRAWERS = {
    "home": draw_home,
    "arrow": draw_arrow,
    "heart": draw_heart,
    "shield": draw_shield,
    "person": draw_person,
}


def create_icon(kind, color):
    img = Image.new("RGBA", (SIZE, SIZE), TRANSPARENT)
    draw = ImageDraw.Draw(img)
    DRAWERS[kind](draw, color)
    return img


def main():
    import os

    out_dir = os.path.join(os.path.dirname(__file__), "..", "static", "tab")
    os.makedirs(out_dir, exist_ok=True)

    for name, kind in ICONS.items():
        create_icon(kind, GRAY).save(os.path.join(out_dir, f"{name}.png"))
        create_icon(kind, GREEN).save(os.path.join(out_dir, f"{name}-active.png"))


if __name__ == "__main__":
    main()
