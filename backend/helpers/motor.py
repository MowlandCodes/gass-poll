from typing import Union


def validate_motors(
    name: str, brand: str, license_plate: str, image_url: str
) -> tuple[bool, Union[str, None]]:
    """
    Validate whether a motor is acceptable

    returns: tuple[bool, Union[str, None]]

    First element (bool) is whether it is valid or not
    Second element (str | None) is the reason
    """
    valid_brand = ["Honda", "Yamaha", "Suzuki"]

    if brand not in valid_brand:
        return False, "Brand is not acceptable"

    if not name.isascii() or len(name) < 2:
        return False, "Motor name must be at least 2 characters"

    if not license_plate.isascii() or len(license_plate) < 3:
        return False, "License Plate is not valid"

    valid_image = (
        image_url.startswith("https://")
        or image_url.startswith("http://")
        or image_url.startswith("public/")
    ) and (
        image_url.endswith(".png")
        or image_url.endswith(".jpg")
        or image_url.endswith(".jpeg")
    )
    if not valid_image:
        return False, "Image URL is not valid"

    return True, None
