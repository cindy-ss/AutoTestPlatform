function exe(str)
	res = os.execute(str)
	return res
end

-- print(exe("pwd"))
print(os.date())