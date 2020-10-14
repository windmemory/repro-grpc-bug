import { generateData } from '../src/data-generator'

const main = async () => {
  const size = process.argv[2]
  generateData(size)
}

main()
