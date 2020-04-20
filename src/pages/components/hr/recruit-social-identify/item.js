import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Divider, FormItem, Input, Select, Option, Cascader, DatePicker } from 'iview';
import { cloneDeep } from 'lodash';
import { getHashUrl } from '@utils/utils';
import { ImgsPreview } from 'wya-vc';
import { FilePreview } from '@components/_common/file-preview/file-preview';
import FileType from '@components/_common/upload/file-type';
import OaSelect from '../recruit-school-summary-edit/common/oa-select.vue';
import OaQuerySelect from './common/oa-search-select.vue';

export default {
	data() {
		return {
			fileType: FileType,
			columns: [
				{
					title: "识别状态",
					key: "status_name",
					minWidth: 150,
					render: (h, params) => {
						const { status, status_name } = params.row;
						return (
							<div>
								{ status_name }
								{ status === 1 && <span>
									（<span
										class="g-pointer g-c-blue-mid"
										onClick={(e) => this.handleWatchResume(e, params)}>
										查看简历
									</span>）
								</span>}
							</div>
						);
					}
				},
				{
					title: "简历名称",
					key: "resume_title",
					fixed: "left",
					minWidth: 150,
					render: (h, params) => {
						return (
							<AutoToolTip
								content={this.formData.formList[params.index].resume_title}
								labelClass=""
								theme="dark"
							/>
						);
					}
				},
				{
					title: "姓名",
					key: "applicant_name",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.applicant_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.applicant_name`}
										rules={this.rule.applicant_name}>
										<Input
											value={this.formData.formList[params.index].applicant_name}
											maxlength={10}
											placeholder="请输入姓名"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'applicant_name')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "应聘职位",
					key: "position_name",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.position_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.position_id`}
										rules={this.rule.position_id}>
										<Cascader
											value={this.formData.formList[params.index].position_id}
											data={this.recruitDePosition}
											clearable
											transfer
											trigger="hover"
											style="width: 160px;"
											placeholder="请选择应聘职位"
											onOn-change={v => this.handleSelectChange(v, params.index, 'position_id')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "性别",
					key: "sex_name",
					minWidth: 136,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.sex === 0 ? '男' : '女'}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.sex`}
										rules={this.rule.sex}>
										<OaSelect
											value={this.formData.formList[params.index].sex}
											index={params.index}
											name="sex"
											style="width: 100px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "手机号码",
					key: "mobile",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.mobile}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.mobile`}
										rules={this.rule.mobile}>
										<Input
											value={this.formData.formList[params.index].mobile}
											maxlength={11}
											placeholder="请输入手机号码"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'mobile')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "招聘渠道",
					key: "ditch",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.ditch_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.ditch`} rules={this.rule.ditch}>
										<OaSelect
											value={this.formData.formList[params.index].ditch}
											index={params.index}
											name="ditch"
											style="width: 160px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "转介绍人",
					key: "introducer_name",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.introducer_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.introducer_id`} rules={this.rule.introducer_id}>
										<OaQuerySelect
											value={this.formData.formList[params.index].introducer_id}
											index={params.index}
											name="introducer_id"
											initName={params.row.introducer_name}
											style="width: 160px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "学历",
					key: "education",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.education_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem
										prop={`formList.${params.index}.education`}
										rules={this.rule.education}>
										<OaSelect
											value={this.formData.formList[params.index].education}
											index={params.index}
											name="education"
											style="width: 160px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "年龄",
					key: "age",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.age}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.age`} rules={this.rule.age}>
										<Input
											value={this.formData.formList[params.index].age}
											maxlength={2}
											placeholder="请输入年龄"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'age')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "期望薪资",
					key: "salary",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.salary}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.salary`} rules={this.rule.salary}>
										<Input
											value={this.formData.formList[params.index].salary}
											maxlength={20}
											placeholder="请输入期望薪资"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'salary')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "工作年限",
					key: "work_time",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.work_time_name}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.work_time`} rules={this.rule.work_time}>
										<OaSelect
											value={this.formData.formList[params.index].work_time}
											index={params.index}
											name="work_time"
											style="width: 160px;"
											change={this.handleSelectChange} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "籍贯",
					key: "region",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.native}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.region`} rules={this.rule.region}>
										<Cascader
											value={this.formData.formList[params.index].region}
											data={this.region}
											clearable
											transfer
											change-on-select
											trigger="hover"
											style="width: 160px;"
											placeholder="请选择籍贯"
											onOn-change={v => this.handleSelectChange(v, params.index, 'region')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "现居住地",
					key: "now_address",
					minWidth: 196,
					render: (h, params) => {
						return (
							<div>
								{ this.formData.formList[params.index].isEditing != 1
									&& <span>{params.row.now_address}</span> }
								{ this.formData.formList[params.index].isEditing == 1
									&& <FormItem prop={`formList.${params.index}.now_address`} rules={this.rule.now_address}>
										<Input
											value={this.formData.formList[params.index].now_address}
											maxlength={50}
											placeholder="请输入现居住地"
											style="width: 160px;"
											onOn-blur={e => this.handleInputBlur(e, params.index, 'now_address')} />
									</FormItem> }
							</div>
						);
					}
				},
				{
					title: "操作",
					key: 'action',
					minWidth: 120,
					align: 'center',
					fixed: "right",
					render: (h, params) => {
						let editing = this.formData.formList[params.index].isEditing;
						return (
							<div class="g-pointer g-c-blue-mid">
								{ editing != 1 && <span onClick={ () => this.handleEdit(params)}>编辑</span>}
								{ editing == 1 && <span>
									<span onClick={ () => this.handleSave(params)}>保存</span>
									<Divider type="vertical" />
									<span onClick={ () => { this.formData.formList[params.index].isEditing = 0; }}>取消</span>
								</span> }
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleInputBlur(e, index, key) {
			this.formData.formList[index][key] = e.target.value;
		},
		handleSelectChange(v, index, key) {
			this.formData.formList[index][key] = v;
		},
		handleEdit(params) {
			this.formData.formList.forEach((it, i) => {
				if (params.index === i) {
					it.isEditing = 1;
				} else {
					it.isEditing = 0;
				}
			});
		},
		handleSave(params) {
			let list = [];
			this.$refs.form.validate(valid => {
				if (valid) {
					list = cloneDeep(this.formData.formList);
					// 处理数据
					list.forEach((it, index) => {
						list[index].depart_id = it.position_id[0];
						list[index].position_id = it.position_id[1];
					});

					this.$request({
						url: '_HR_RECRUIT_IDENTIFY_RESUME_EDIT_POST',
						type: 'POST',
						param: {
							...list[params.index],
							depart_id: list[params.index].depart_id || this.basicForm.position_id[0],
							position_id: list[params.index].position_id || this.basicForm.position_id[1],
							introducer_id: list[params.index].introducer_id || this.basicForm.introducer_id[1],
							ditch: list[params.index].ditch || this.basicForm.ditch,
							province: list[params.index].region[0],
							city: list[params.index].region[1],
							add_type: 2
						},
						loading: false
					}).then((res) => {
						this.$Message.success('操作成功');
						this.formData.formList[params.index].isEditing = 0;
						this.loadData();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				} else {
					this.$Message.warning('数据格式不正确');
				}
			});
		},
		handleWatchResume(e, params) {
			let type = '';
			let index;
			if (params.row.resume_url) {
				index = params.row.resume_url.lastIndexOf('.');
				type = params.row.resume_url.slice(index);
				type = this.fileType[type.toLowerCase()].type;

				if (type === 'image') {
					this.$emit('preview-start');
					ImgsPreview.popup({
						visible: true,
						dataSource: [params.row.resume_url],
						opts: {
							index: 0,
							history: false,
							getThumbBoundsFn: (i) => i
						}
					}).then(() => {
					}).catch(() => {
					}).finally(() => {
						this.$emit('preview-end');
					});
				} else {
					this.$emit('preview-start');
					FilePreview.popup({
						data: {
							fileUrl: params.row.resume_url,
							x: e.clientX,
							y: e.clientY
						}
					}).then((res) => {
					}).catch((err) => {
					}).finally(() => {
						this.$emit('preview-end');
					});
				}
			}
			// 砍掉了
			// this.$router.push(getHashUrl(`/hr/recruit/school/resume/img`, {
			// 	url: params.row.resume_url,
			// 	recruitType: 'school'
			// }));
		}
	}
};

