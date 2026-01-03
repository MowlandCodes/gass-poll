def serialize_doc(doc):
    if not doc:
        return None

    doc["_id"] = str(doc["_id"])

    if "user_id" in doc:
        doc["user_id"] = str(doc["user_id"])
    if "motor_id" in doc:
        doc["motor_id"] = str(doc["motor_id"])

    return doc
