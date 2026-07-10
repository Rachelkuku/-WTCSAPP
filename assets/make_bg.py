from PIL import Image, ImageFilter
import numpy as np
from rembg import remove
from scipy.ndimage import binary_dilation

def make_bg_only(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path).convert("RGBA")
    img_array = np.array(img)

    # rembg로 캐릭터 마스크 추출
    removed = remove(img)
    removed_array = np.array(removed)
    char_mask = removed_array[:, :, 3] > 100  # 캐릭터 영역

    # 마스크를 약간 확장해서 경계선도 처리
    dilated_mask = binary_dilation(char_mask, iterations=20)

    # 배경 이미지를 강하게 블러 처리
    rgb = img_array[:, :, :3]
    blurred = np.array(Image.fromarray(rgb).filter(ImageFilter.GaussianBlur(radius=40)))

    # 캐릭터 영역을 블러 처리된 배경으로 대체
    output_rgb = rgb.copy()
    output_rgb[dilated_mask] = blurred[dilated_mask]

    # 결과 저장 (완전 불투명)
    output = img_array.copy()
    output[:, :, :3] = output_rgb
    output[:, :, 3] = 255

    result = Image.fromarray(output.astype(np.uint8))
    result.save(output_path)
    print(f"  -> Saved {output_path}")

make_bg_only("mascot2.png", "bg_sky.png")
make_bg_only("mascot.png", "bg_lavender.png")
print("Done!")
