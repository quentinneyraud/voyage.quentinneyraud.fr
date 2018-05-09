const DEFAULT_INFOS = {
  developers: [],
  libraries: [],
  librariesTitle: 'Libraries:',
  librariesTitleStyle: 'text-decoration:underline;font-size:14px;color:#EEE;background-color:#2D2D2D;padding:5px;margin:10px 0',
  libraryNameStyle: 'background-color:orange;padding:5px',
  libraryUrlStyle: 'margin-left:10px',
  developersTitle: 'Developed by:',
  developersTitleStyle: 'text-decoration:underline;font-size:14px;color:#EEE;background-color:#2D2D2D;padding:5px;margin:10px 0',
  developerNameStyle: 'background-color:orange;padding:5px',
  developerUrlStyle: 'margin-left:10px'
}

const thanksDevelopers = (developers, infos) => {
  developers.forEach(developer => console.log(`%c${developer.name}%c${developer.url}`, infos.developerNameStyle, infos.developerUrlStyle))
}

const thanksLibraries = (libraries, infos) => {
  libraries.forEach(library => console.log(`%c${library.name}%c${library.url}`, infos.libraryNameStyle, infos.libraryUrlStyle))
}

export default (infos) => {
  infos = {
    ...DEFAULT_INFOS,
    ...infos
  }

  if (infos.hasOwnProperty('developers')) {
    console.log(`%c${infos.developersTitle}`, infos.developersTitleStyle)
    thanksDevelopers(infos.developers, infos)
  }
  if (infos.hasOwnProperty('libraries')) {
    console.log(`%c${infos.librariesTitle}`, infos.librariesTitleStyle)
    thanksLibraries(infos.libraries, infos)
  }
}
