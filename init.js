exports.configure = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the name?'
  },
	{
    type: 'input',
    name: 'desc',
    message: 'What is the description?'
  },
	{
    type: 'list',
    name: 'license',
    message: 'What is the license?',
		choices: [
			{
				name: 'AGPL',
				value: 'AGPL-3.0+'
			},
			{
				name: 'GPL',
				value: 'GPL-3.0+'
			},
      {
        name: 'LGPL',
        value: 'LGPL-3.0+'
      },
			{
				name: 'APACHE',
				value: 'APACHE-2.0'
			}
		]
  },
  {
    type: 'confirm',
    name: 'travis',
    message: 'Do you want to utilize Travis CI?',
    default: true
  }	
];

exports.beforeRender = function(utils, config) {

	switch (config.license) {
		case 'AGPL-3.0+':
		config.license_longname = '**GNU Affero General Public License Version 3** or any later version';
		break;
		case 'GPL-3.0+':
		config.license_longname = '**GNU General Public License Version 3** or any later version';
		break;
    case 'LGPL-3.0+':
		config.license_longname = '**GNU Lesser General Public License Version 3** or any later version';
		break;
		case 'APACHE-2.0':
		config.license_longname = '**Apache License 2.0**';
		break;
		default:
		break;
	}
	
};

exports.after = function(utils, config) {
	return Promise.all([
		utils.src.read('templates/licenses/' + config.license + '/license.txt'),
		utils.src.read('templates/licenses/' + config.license + '/header.esl'),
		utils.target.read('src/index.js'),
		utils.target.read('test/index.spec.js')
	]).then(function(result) {
		return Promise.all([
			utils.target.write('LICENSE.txt', result[0]),
			utils.target.write('src/index.js', result[1] + result[2], config),
			utils.target.write('test/index.spec.js', result[1] + result[3], config)
		]);
	}).then(function() {
		if (!config.travis) {
			utils.target.remove('.travis.yml');
		}		
	});
};
	
