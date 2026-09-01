import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { t as supabase } from "./supabase-B0HIM6lB.mjs";
import { t as Route } from "./visualizar._id-DGQEJUuy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visualizar._id-CjQD3WDs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnamnesePublica() {
	const { id } = Route.useParams();
	const [client, setClient] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [birthDate, setBirthDate] = (0, import_react.useState)("");
	const [profession, setProfession] = (0, import_react.useState)("");
	const [mainComplaint, setMainComplaint] = (0, import_react.useState)("");
	const [symptomDuration, setSymptomDuration] = (0, import_react.useState)("Não informado");
	const [previousTreatment, setPreviousTreatment] = (0, import_react.useState)("Não");
	const [previousSurgeries, setPreviousSurgeries] = (0, import_react.useState)("");
	const [healthConditions, setHealthConditions] = (0, import_react.useState)([]);
	const [hasAllergies, setHasAllergies] = (0, import_react.useState)(false);
	const [allergies, setAllergies] = (0, import_react.useState)("");
	const [medications, setMedications] = (0, import_react.useState)("");
	const [footConditions, setFootConditions] = (0, import_react.useState)([]);
	const [skinType, setSkinType] = (0, import_react.useState)("Normal");
	const [observations, setObservations] = (0, import_react.useState)("");
	const [recommendations, setRecommendations] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		async function loadClient() {
			setLoading(true);
			setError("");
			const { data, error } = await supabase.from("clients").select("id, name, phone").eq("id", id).maybeSingle();
			if (error) {
				console.error("Erro ao carregar cliente:", error);
				setError("Não foi possível carregar os dados do cliente.");
				setLoading(false);
				return;
			}
			if (!data) {
				setError("Cliente não encontrado.");
				setLoading(false);
				return;
			}
			setClient(data);
			setLoading(false);
		}
		loadClient();
	}, [id]);
	function toggleItem(item, current, setter) {
		setter(current.includes(item) ? current.filter((value) => value !== item) : [...current, item]);
	}
	async function handleSubmit(event) {
		event.preventDefault();
		if (!client) {
			setError("Cliente não encontrado.");
			return;
		}
		setSaving(true);
		setError("");
		setSuccess(false);
		const { error: saveError } = await supabase.from("anamneses").upsert({
			client_id: client.id,
			birth_date: birthDate || null,
			profession: profession.trim() || null,
			main_complaint: mainComplaint.trim() || null,
			symptom_duration: symptomDuration === "Não informado" ? null : symptomDuration,
			previous_podological_treatment: previousTreatment,
			previous_surgeries: previousSurgeries.trim() || null,
			health_conditions: healthConditions,
			has_allergies: hasAllergies,
			allergies: hasAllergies ? allergies.trim() || null : null,
			medications: medications.trim() || null,
			foot_conditions: footConditions,
			skin_type: skinType,
			observations: observations.trim() || null,
			recommendations: recommendations.trim() || null,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}, { onConflict: "client_id" });
		if (saveError) {
			console.error("Erro ao salvar ficha:", saveError);
			setError("Não foi possível salvar sua ficha. Tente novamente.");
			setSaving(false);
			return;
		}
		setSaving(false);
		setSuccess(true);
	}
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "card-surface p-6 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando ficha..."
				})
			})
		})
	});
	if (!client) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-6 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-bold",
					children: "Ficha indisponível"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: error
				})]
			})
		})
	});
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto max-w-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-surface p-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto grid size-14 place-items-center rounded-full bg-primary-soft text-primary",
						children: "✓"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 text-2xl font-bold",
						children: "Ficha enviada!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm leading-6 text-muted-foreground",
						children: [
							"Obrigado, ",
							client.name,
							". Suas informações foram enviadas com sucesso."
						]
					})
				]
			})
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-background px-4 py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight",
					children: "Ficha de Anamnese"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: [
						"Olá, ",
						client.name,
						". Preencha as informações abaixo antes do seu atendimento."
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold text-primary",
								children: "Dados pessoais"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Data de nascimento",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "date",
									value: birthDate,
									onChange: (event) => setBirthDate(event.target.value),
									className: inputClass
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Profissão",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: profession,
									onChange: (event) => setProfession(event.target.value),
									placeholder: "Ex.: Professora",
									className: inputClass
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold text-primary",
								children: "Queixa principal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Motivo da consulta",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: mainComplaint,
									onChange: (event) => setMainComplaint(event.target.value),
									placeholder: "Descreva o motivo da consulta...",
									rows: 4,
									className: textareaClass
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tempo dos sintomas",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: symptomDuration,
									onChange: (event) => setSymptomDuration(event.target.value),
									className: selectClass,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Não informado" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Menos de 1 semana" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "1 a 4 semanas" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mais de 1 mês" })
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold text-primary",
								children: "Histórico"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Já realizou tratamento podológico?",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: previousTreatment,
									onChange: (event) => setPreviousTreatment(event.target.value),
									className: selectClass,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Não" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sim, recentemente" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sim, há mais de 1 ano" })
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Cirurgias anteriores",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: previousSurgeries,
									onChange: (event) => setPreviousSurgeries(event.target.value),
									placeholder: "Descreva, se houver...",
									rows: 3,
									className: textareaClass
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-3 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-primary",
							children: "Condições de saúde"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckGroup, {
							items: [
								"Diabetes",
								"Hipertensão",
								"Problemas circulatórios",
								"Problemas renais",
								"Gestante"
							],
							selected: healthConditions,
							onToggle: (item) => toggleItem(item, healthConditions, setHealthConditions)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold text-primary",
								children: "Alergias"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex min-h-12 cursor-pointer items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: hasAllergies,
									onChange: (event) => setHasAllergies(event.target.checked),
									className: "size-5 accent-primary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[15px]",
									children: "Possuo alergias"
								})]
							}),
							hasAllergies && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Quais?",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									value: allergies,
									onChange: (event) => setAllergies(event.target.value),
									placeholder: "Ex.: esparadrapo, iodo...",
									className: inputClass
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-primary",
							children: "Medicamentos"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Uso contínuo",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								value: medications,
								onChange: (event) => setMedications(event.target.value),
								placeholder: "Liste os medicamentos em uso...",
								rows: 4,
								className: textareaClass
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-base font-bold text-primary",
								children: "Avaliação dos pés"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckGroup, {
								items: [
									"Unha encravada",
									"Micose",
									"Calosidade",
									"Rachaduras",
									"Verruga plantar"
								],
								selected: footConditions,
								onToggle: (item) => toggleItem(item, footConditions, setFootConditions)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Tipo de pele",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: skinType,
									onChange: (event) => setSkinType(event.target.value),
									className: selectClass,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Normal" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Seca" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Oleosa" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Muito ressecada" })
									]
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "card-surface space-y-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-primary",
							children: "Observações"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: observations,
							onChange: (event) => setObservations(event.target.value),
							placeholder: "Alguma informação adicional?",
							rows: 4,
							className: textareaClass
						})]
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive",
						children: error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						disabled: saving,
						className: "min-h-14 w-full rounded-2xl bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-float transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60",
						children: saving ? "Enviando ficha..." : "Enviar ficha"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "pb-6 text-center text-xs leading-5 text-muted-foreground",
						children: "Suas informações serão enviadas de forma segura para o profissional responsável pelo seu atendimento."
					})
				]
			})]
		})
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block space-y-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-medium text-muted-foreground",
			children: label
		}), children]
	});
}
function CheckGroup({ items, selected, onToggle }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex min-h-12 cursor-pointer items-center gap-3 rounded-xl px-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: selected.includes(item),
				onChange: () => onToggle(item),
				className: "size-5 shrink-0 accent-primary"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[15px]",
				children: item
			})]
		}, item))
	});
}
var inputClass = "h-13 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";
var selectClass = "h-13 w-full rounded-xl border border-border bg-background px-4 text-[15px] outline-none focus:border-primary";
var textareaClass = "w-full resize-none rounded-xl border border-border bg-background px-4 py-3.5 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary";
//#endregion
export { AnamnesePublica as component };
