/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, commands } from 'vscode';
import * as utils from './utils';
import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	
	let removeConsoleLog = commands.registerTextEditorCommand('extension.removeConsoleLog', function () {
		utils.commandsImplementation('console\\.log');
	});

	let removeConsoleError = commands.registerTextEditorCommand('extension.removeConsoleError', function () {
		utils.commandsImplementation('console\\.error');
	});


	let removeConsoleWarn = commands.registerTextEditorCommand('extension.removeConsoleWarn', function () {
		utils.commandsImplementation('console\\.warn');
	});

	
	let removeConsoleDebug = commands.registerTextEditorCommand('extension.removeConsoleDebug', function () {
		utils.commandsImplementation('console\\.debug');
	});

	let removeAllConsoleStatements = commands.registerTextEditorCommand('extension.removeAllConsoleStatements', function () {
		utils.commandsImplementation('\\bconsole\\.(log|warn|error|debug)\\b');
	});

	context.subscriptions.push(removeConsoleLog);
	context.subscriptions.push(removeConsoleError);
	context.subscriptions.push(removeConsoleWarn);
	context.subscriptions.push(removeConsoleDebug);
	context.subscriptions.push(removeAllConsoleStatements);

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'javascript' },{ scheme: 'file', language: 'typescript' },{ scheme: 'file', language: 'html' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}