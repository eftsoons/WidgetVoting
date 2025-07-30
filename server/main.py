from os import listdir
from datetime import datetime
import json, time, shutil

def is_valid_json(json_str):
    try:
        json.dumps(json_str, ensure_ascii=False)
        return True
    except json.JSONDecodeError:
        return False

while 1:
	time.sleep(0.1)
	for folderlist in listdir("./bass"):
		try:
			with open(f"./bass/{folderlist}/tabl.json", "r", encoding='utf-8') as file:
				tabl = json.loads(file.read())

			for x in range(0, len(tabl["rows"])):
				if tabl["rows"][x]["time"] == datetime.today().strftime("%d.%m.%Y %H:%M:%S") and tabl["rows"][x]["active6"]:
					if is_valid_json(tabl["rows"][x]):
						tabl["rows"][x]["active2"] = False
						tabl["rows"][x]["active6"] = False
						fileset = open(f"./bass/{folderlist}/tabl.json", "w", encoding='utf-8')
						fileset.write(json.dumps(tabl, ensure_ascii=False))
						fileset.close()
					else:
						print("JSON некорректен")
		except:
			pass
