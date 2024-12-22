res = ""
delimiteur = ','
filieres = {'info': 'Informatique', 'telecom': 'Télécom', 'matmeca': 'Matmeca', 'elec': 'Électronique', 'see': 'SEE', 'ri': 'RI'}
for semestre in range(6, 7):
    res += f'"Semestre {semestre}" :' + " {\n"
    for filiere in filieres.keys():
        try:
            with open(f"./data/S{semestre}_{filiere}.csv", 'r', encoding='utf8') as file:
                lines = file.read().split('\n')
        except FileNotFoundError:
            print(f"{semestre} {filiere} non trouvé")
        else:
            res += f'    "{filieres[filiere]}": ' + '{'
            for i, l in enumerate(lines):
                arg = l.split(delimiteur)
                if len(arg) < 8:
                    continue
                if arg[3] == "UE":
                    if i > 2:
                        res += "\n        ],"
                    res += f'\n        "{" - ".join(arg[4].split(' - ')[1:]).strip()}": ['
                elif arg[3] == "MODULE":
                    coef = arg[8].replace(',', '.')
                    if not coef:
                        continue
                    res += '\n            {nom: "' + arg[4].strip() + '", note: "", coef: ' + coef + '},'
            if res[-1] == "[":
                res = "\n".join(res.split('\n')[:-1])           
            else:
                res = res[:-1]
                res += '\n        ]'
            res += '\n    },\n'
    res = res[:-2]
    res += '\n},\n'
res = res[:-1]


with open('result_dict.js', 'w', encoding='utf8') as file:
    file.write(res)