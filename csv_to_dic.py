res = ""
for semestre in range(5, 11):
    res += f"semestre{semestre}" + " {\n"
    for filiere in ['info', 'telecom', 'matmeca', 'elec', 'see', 'ri']:
        try:
            with open(f"./data/S{semestre}_{filiere}.csv", 'r', encoding='utf8') as file:
                lines = file.read().split('\n')
        except FileNotFoundError:
            print(f"{semestre} {filiere} non trouvé")
        else:
            res += f"    {filiere}: ["
            for l in lines:
                arg = l.split(';')
                if len(arg) >= 8 and arg[3] == "MODULE":
                    nom = arg[4].replace('S5', '').replace('(', '').replace(')', '').repalce(',', '.')
                    for i in range(10):
                        nom = nom.replace(f"n°{i}", '')
                    nom = nom.strip()
                    res += '\n        {nom: "' + nom + '", note: "", coef: ' + arg[8] + '},'
            res = res[:-1]
            res += '\n    ],\n'
    res = res[:-1]
    res += '},\n'
res = res[:-1]
print(res)